import {
  requestGetHotelDetail,
  requestSearchHotels
} from '../../lib/services/hotels';
import SelectHotel from '../SelectHotel';
import HotelDetail from '../HotelDetail';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined; _id: string };
}

const HotelDetailWrapper: React.FC<Props> = async ({ searchParams }) => {
  const { limit = '10', page = '1', query, _id } = searchParams;
  const offset = Number(limit) * (Number(page) - 1);

  if (!_id) return;

  const hotelsRes: FetchListResult<Hotel[]> = await requestSearchHotels({
    offset,
    limit,
    query
  });

  const { items: hotels } = hotelsRes.data;

  const hotelRes: FetchResult<Hotel> = await requestGetHotelDetail(_id);
  const hotel = hotelRes.data;

  return (
    <div id={`#${hotel._id}}`} className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Hotel Details</h1>

      <div className="mx-auto">
        <SelectHotel items={hotels} current={hotel} />

        <HotelDetail hotel={hotel} />
      </div>
    </div>
  );
};

export default HotelDetailWrapper;
