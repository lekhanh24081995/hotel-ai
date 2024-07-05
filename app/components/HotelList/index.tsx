import {
  requestGetHotels,
  requestSearchHotels
} from '../../lib/services/hotels';
import { Card } from '../ui/card';
import HotelTable from '../HotelTable';

interface HotelListProps {
  searchParams: { [key: string]: string | string[] | undefined; page?: string };
}

const HotelList: React.FC<HotelListProps> = async ({ searchParams }) => {
  const { limit = '10', page = '1', query } = searchParams;
  const offset = Number(limit) * (Number(page) - 1);
  const hotelsRes: FetchListResult<Hotel[]> = await requestSearchHotels({
    offset,
    limit,
    english_name: query,
    vietnamese_name: query
  });

  const {
    items: hotels,
    pagination: { total }
  } = hotelsRes.data;

  const params = new URLSearchParams();
  page && params.set('page', page);

  const totalPages = Math.ceil(total / Number(limit));

  return (
    <>
      {hotels.length > 0 ? (
        <div className="container mx-auto px-4 pb-8">
          <h1 className="text-3xl font-bold">Hotel Infomation</h1>

          <HotelTable
            hotels={hotels}
            total={total}
            totalPages={totalPages}
            params={params}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Card className="max-w-xl rounded-lg p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-primary">
              No Hotels Found
            </h2>
            <p className="mb-6 text-gray-600">
              We couldn&apos;t find any hotels that match your search criteria.
              Please try adjusting your search filters or check back later for
              updated availability.
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default HotelList;
