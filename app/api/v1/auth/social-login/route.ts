import { mongooseConnect } from '@/app/lib/mongoose';
import User from '@/app/lib/models/User';
import { ApiError, handleError } from '@/app/lib/exceptions';
import { generateAccessToken, generateRefreshToken } from '@/app/lib/tokens';
import AvailableToken from '@/app/lib/models/AvailableToken';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  await mongooseConnect();
  const res = await req.json();

  const { email, name, image, is_verified, provider, providerAccountId } = res;

  let user;
  try {
    user = await User.findOne({ email });

    if (user) {
      const providerExists = user.providers.some(
        (p: any) =>
          p.provider === provider && p.providerAccountId === providerAccountId
      );

      if (!providerExists) {
        await User.findOneAndUpdate(
          { email },
          {
            $addToSet: {
              providers: {
                provider,
                providerAccountId
              }
            }
          }
        );
      }

      if (!is_verified) {
        const error = ApiError.fromUnverified();
        return handleError(error, 403);
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const randomString = crypto.randomUUID();
      const password = await bcrypt.hash(randomString, salt);

      user = await User.create({
        full_name: name,
        email,
        password,
        image,
        is_verified,
        providers: [
          {
            provider,
            providerAccountId
          }
        ]
      });
    }

    const { access_token, expires_in } = generateAccessToken(user.id);
    const refresh_token = generateRefreshToken(user.id);

    await AvailableToken.create({
      user: user.id,
      refresh_token
    });

    return Response.json({
      status_code: 200,
      message: 'Success',
      data: {
        access_token,
        refresh_token,
        token_type: 'Bearer',
        expires_in
      }
    });
  } catch {
    const error = ApiError.fromUnexpected();
    return handleError(error, 500);
  }
}
