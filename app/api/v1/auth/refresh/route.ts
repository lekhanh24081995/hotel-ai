import { ApiError, handleError } from '@/app/lib/exceptions';
import AvailableToken from '@/app/lib/models/AvailableToken';
import { mongooseConnect } from '@/app/lib/mongoose';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from '@/app/lib/tokens';
import { JwtPayload } from 'jsonwebtoken';

export async function POST(req: Request) {
  await mongooseConnect();
  const res = await req.json();
  const { refresh_token } = res;

  if (!refresh_token) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }

  const decoded = verifyToken(refresh_token, 'refresh') as JwtPayload;
  if (!decoded) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }
  const userId = decoded.userId;

  const token = await AvailableToken.findOne({ refresh_token });

  if (!token) {
    const error = ApiError.fromInvalidToken();
    return handleError(error, 401);
  }

  try {
    await AvailableToken.findOneAndDelete({
      $and: [
        {
          user: userId
        },
        {
          refresh_token: refresh_token
        }
      ]
    });

    const { access_token, expires_in } = generateAccessToken(userId);
    const new_refresh_token = generateRefreshToken(userId);

    await AvailableToken.create({
      user: userId,
      refresh_token: new_refresh_token
    });

    return Response.json({
      status_code: 201,
      message: 'Success',
      data: {
        access_token,
        refresh_token: new_refresh_token,
        expires_in
      }
    });
  } catch (error: any) {
    return Response.json({});
  }
}
