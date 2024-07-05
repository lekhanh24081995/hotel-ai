import { ApiError, handleError } from '@/app/lib/exceptions';
import RegisterToken from '@/app/lib/models/RegisterToken';
import User from '@/app/lib/models/User';
import { mongooseConnect } from '@/app/lib/mongoose';
import { verifyToken } from '@/app/lib/tokens';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(
  req: Request,
  {
    params
  }: {
    params: { token: string };
  }
) {
  await mongooseConnect();

  const { token } = params;

  try {
    const decoded = verifyToken(token, 'register') as JwtPayload;
    const userId = decoded.userId;

    const register_token = await RegisterToken.findOne({
      register_token: token
    });

    if (!register_token) {
      const error = ApiError.fromInvalidRegisterToken();
      return handleError(error, 401);
    }

    await User.findByIdAndUpdate(
      userId,
      {
        is_verified: true
      },
      {
        new: true
      }
    );

    await RegisterToken.findByIdAndDelete(register_token.id);

    return Response.json({ status_code: 200, message: 'Success' });
  } catch (e) {
    const error = ApiError.fromInvalidToken();
    return handleError(error, 401);
  }
}
