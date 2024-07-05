import { mongooseConnect } from '@/app/lib/mongoose';
import Hotel from '@/app/lib/models/Hotel';
import { ApiError, handleError } from '@/app/lib/exceptions';
import { generateConditions } from '@/app/lib/utils/common';

export async function GET(req: Request) {
  await mongooseConnect();

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit') || 10;
  const offset = searchParams.get('offset') || 0;
  const queryObject = Object.fromEntries(searchParams.entries());
  const conditions = generateConditions(queryObject) || [];
  const query = conditions.length > 0 ? { $or: conditions } : {};

  try {
    const totalHotels = await Hotel.find(query);

    const hotels = await Hotel.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({
        created_at: -1
      });

    return Response.json({
      status_code: 200,
      message: 'Success',
      data: {
        items: hotels,
        pagination: {
          total: totalHotels.length,
          limit,
          offset
        },
        link: {
          self: '',
          next: '',
          last: ''
        }
      }
    });
  } catch (e) {
    const error = ApiError.fromNotfound();
    return handleError(error, 404);
  }
}
