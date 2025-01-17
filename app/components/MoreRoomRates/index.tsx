'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { format } from 'date-fns';

type Props = {
  items: any[];
  currency: string;
  limit: number;
};

function MoreRoomRates({ items, currency, limit }: Props) {
  const [moreRooms, setMoreRooms] = useState<any[]>([]);
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);

  const handleMore = () => {
    if (isEnd) {
      setMoreRooms([]);
      setSkip(0);
      setIsEnd(false);
      return;
    }

    if (skip >= items.length) {
      setIsEnd(true);
    } else {
      const newItems = items.slice(skip, skip + limit);
      setMoreRooms((prev) => prev.concat(newItems));
      setSkip((prevSkip) => prevSkip + limit);
    }
  };
  return (
    <>
      {moreRooms.length > 0 &&
        moreRooms.map((room, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="border-b border-gray-200 px-4 py-2 text-xs md:text-sm">
              {room.room_type}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center text-xs md:text-sm">
              {room.price.toLocaleString()} {currency}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center text-xs md:text-sm">
              {room.price_type}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center text-xs md:text-sm">
              {format(room.period.start_date, 'yyyy-MM-dd')}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center text-xs md:text-sm">
              {format(room.period.end_date, 'yyyy-MM-dd')}
            </td>
          </tr>
        ))}

      <tr>
        <td colSpan={5} className="border-t-2 border-gray-200 pt-8">
          <div className="w-full md:text-center">
            <Button
              type="button"
              className="h-8 w-full max-w-32 md:h-9"
              onClick={handleMore}
            >
              {!isEnd ? 'Show more' : 'Show less'}
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default MoreRoomRates;
