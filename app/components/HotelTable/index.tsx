import Pagination from '../Pagination';
import Link from 'next/link';
import { LIST_ROUTER } from '../../lib/constants/common';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

type Props = {
  hotels: Hotel[];
  total: number;
  totalPages: number;
  params?: URLSearchParams;
  onViewDetail?: (name: string) => void;
};
export default function HotelTable({
  hotels,
  total,
  totalPages,
  params,
  onViewDetail
}: Props) {
  return (
    <div className="grid gap-6">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="border border-gray-200 bg-white">
          <thead>
            <tr>
              <th className="min-w-28 border-b border-gray-200 bg-gray-100 p-4 text-sm md:text-base">
                Vietnamese Name
              </th>
              <th className="min-w-28 border-b border-gray-200 bg-gray-100 p-4 text-sm md:text-base">
                English Name
              </th>
              <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4 text-sm md:min-w-72 md:text-base">
                Address
              </th>
              <th className="min-w-28 border-b border-gray-200 bg-gray-100 p-4 text-sm md:text-base">
                Contact
              </th>
              <th className="min-w-28 whitespace-nowrap border-b border-gray-200 bg-gray-100 p-4 text-sm md:text-base">
                Phone
              </th>
              <th className="min-w-28 border-b border-gray-200 bg-gray-100 p-4 text-sm md:text-base">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id}>
                <td className="border-b border-gray-200 px-4 py-2 text-xs md:text-base">
                  {hotel.vietnamese_name}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-xs md:text-base">
                  {hotel.english_name}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-xs md:text-base">
                  {hotel.address}, {hotel.province}, {hotel.country}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-xs md:text-base">
                  {hotel.contact}
                </td>
                <td className="whitespace-nowrap border-b border-gray-200 px-4 py-2 text-xs md:text-base">
                  {hotel.phone}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-center text-xs md:text-base">
                  {params ? (
                    <Button
                      className="h-8 py-1 text-xs md:h-10 md:text-base"
                      asChild
                    >
                      <Link
                        href={`${LIST_ROUTER.HOTEL}?${params.toString()}&_id=${hotel._id}#${hotel._id}`}
                      >
                        View
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="h-8 py-1 text-xs md:h-10 md:text-base"
                      onClick={() => onViewDetail?.(hotel.english_name)}
                    >
                      View
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Card className="self-start p-2">
          <p className="text-sm text-primary md:text-base">
            Showing {hotels.length} of {total} entries
          </p>
        </Card>

        {hotels.length > 0 && <Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}
