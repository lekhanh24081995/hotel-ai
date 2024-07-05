import { ApiError, handleError } from '@/app/lib/exceptions';
import User from '@/app/lib/models/User';
import { mongooseConnect } from '@/app/lib/mongoose';
import { verifyToken } from '@/app/lib/tokens';
import { JwtPayload } from 'jsonwebtoken';
import { headers } from 'next/headers';

export async function GET() {
  await mongooseConnect();

  const headerList = headers();
  const access_token = headerList.get('Authorization')?.split(' ')[1];

  if (!access_token) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }

  const decoded = verifyToken(access_token, 'access') as JwtPayload;
  if (!decoded) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }
  const userId = decoded.userId;
  const user = await User.findById(userId).select('-password');

  if (!user) {
    const error = ApiError.fromNotfound();
    return handleError(error, 404);
  }

  return Response.json({
    status_code: 200,
    message: 'Success',
    data: user
  });
}
