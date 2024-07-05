import { mongooseConnect } from '@/app/lib/mongoose';
import bcrypt from 'bcrypt';
import User from '@/app/lib/models/User';
import { headers } from 'next/headers';
import initTranslations from '@/app/i18n';
import * as yup from 'yup';
import { ApiError, handleError } from '@/app/lib/exceptions';
import { loginSchema } from '@/app/lib/yup-schema';
import { generateAccessToken, generateRefreshToken } from '@/app/lib/tokens';
import AvailableToken from '@/app/lib/models/AvailableToken';

export async function POST(req: Request) {
  await mongooseConnect();
  const res = await req.json();

  const { email, password } = res;
  const lang = headers().get('Accept-Language') || 'en';
  const { t } = await initTranslations(lang, ['common']);

  try {
    await loginSchema(t).validate(
      {
        email,
        password
      },
      {
        abortEarly: false
      }
    );
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const apiError = ApiError.fromYupError(error, 'LO-0001');
      return handleError(apiError, 400);
    } else {
      const apiError = ApiError.fromUnexpected();
      return handleError(apiError, 500);
    }
  }

  const user = await User.findOne({
    $or: [{ email }]
  });

  if (!user) {
    const error = ApiError.fromInvalidEmailPassword();
    return handleError(error, 400);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    const error = ApiError.fromInvalidEmailPassword();
    return handleError(error, 400);
  }

  if (!user.is_verified) {
    const error = ApiError.fromUnverified();
    return handleError(error, 403);
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
}
