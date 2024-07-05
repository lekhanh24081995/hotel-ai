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
            <td className="border-b border-gray-200 px-4 py-2">
              {room.room_type}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center">
              {room.price.toLocaleString()} {currency}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center">
              {room.price_type}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center">
              {format(room.period.start_date, 'yyyy-MM-dd')}
            </td>
            <td className="border-b border-gray-200 px-4 py-2 text-center">
              {format(room.period.end_date, 'yyyy-MM-dd')}
            </td>
          </tr>
        ))}

      <tr>
        <td colSpan={5} className="border-t-2 border-gray-200 pt-8">
          <div className="w-full md:text-center">
            <Button
              type="button"
              className="w-full max-w-32"
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
