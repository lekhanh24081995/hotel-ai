import { ApiError, handleError } from '@/app/lib/exceptions';
import AvailableToken from '@/app/lib/models/AvailableToken';
import { mongooseConnect } from '@/app/lib/mongoose';
import { verifyToken } from '@/app/lib/tokens';
import { JwtPayload } from 'jsonwebtoken';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  await mongooseConnect();

  const { refresh_token } = await req.json();
  const headerList = headers();
  const access_token = headerList.get('Authorization')?.split(' ')[1];

  if (!access_token) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }

  const decoded = verifyToken(access_token, 'access') as JwtPayload;

  if (!decoded) {
    const error = ApiError.fromInvalidToken();
    return handleError(error, 401);
  }
  const userId = decoded.userId;

  const token = await AvailableToken.findOne({ refresh_token });

  if (!token) {
    const error = ApiError.fromInvalidToken();
    return handleError(error, 401);
  }

  await AvailableToken.findOneAndDelete({
    $and: [
      {
        user: userId
      },
      {
        refresh_token
      }
    ]
  });

  return Response.json({
    status_code: 200,
    message: 'Success'
  });
}
