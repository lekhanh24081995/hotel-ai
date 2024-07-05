import { mongooseConnect } from '@/app/lib/mongoose';
import Hotel from '@/app/lib/models/Hotel';
import { ApiError, handleError } from '@/app/lib/exceptions';

export async function GET(
  req: Request,
  {
    params
  }: {
    params: {
      _id: string;
    };
  }
) {
  try {
    await mongooseConnect();

    const { _id } = params;

    const hotel = await Hotel.findById(_id);

    if (!hotel) {
      const error = ApiError.fromNotfound();
      return handleError(error, 404);
    }

    return Response.json({
      status_code: 200,
      message: 'Success',
      data: hotel
    });
  } catch (e) {
    const error = ApiError.fromUnexpected();
    return handleError(error, 5005);
  }
}
