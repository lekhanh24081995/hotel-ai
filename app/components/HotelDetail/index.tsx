'use client';

import React from 'react';
import { Card } from '../ui/card';
import { format } from 'date-fns';
import MoreRoomRates from '../MoreRoomRates';

type Props = {
  hotel: Hotel;
};
export default function HotelDetail({ hotel }: Props) {
  return (
    <div className="flex flex-col gap-6 overflow-scroll">
      <Card className="p-6">
        <h3 className="mb-4 text-xl font-bold">Contact</h3>
        <p className="whitespace-pre-line text-lg">
          <strong>{hotel.country}: </strong> {hotel.phone}, {hotel.contact}
        </p>
      </Card>

      {hotel.offers.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-xl font-bold">Offers</h3>
          <ul className="list-inside list-disc">
            {hotel.offers.map((offer, index) => (
              <li key={index} className="text-lg">
                {offer}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {hotel.terms_and_conditions.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-xl font-bold">Terms and Conditions</h3>
          <ul className="list-inside list-disc">
            {hotel.terms_and_conditions.map((term, index) => (
              <li key={index} className="text-lg">
                {term}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {hotel.room_rate.length > 0 && (
        <Card
          className="w-full overflow-x-auto
p-6 scrollbar-hide"
        >
          <h3 className="mb-4 text-xl font-bold">Room Rates</h3>

          <table className="border-t border-gray-200 bg-white">
            <thead>
              <tr>
                <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4">
                  Room Type
                </th>
                <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                  Price
                </th>
                <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                  Price Type
                </th>
                <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                  Start Date
                </th>
                <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                  End Date
                </th>
              </tr>
            </thead>

            <tbody>
              {hotel.room_rate.slice(0, 10).map((room, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="border-b border-gray-200 px-4 py-2">
                    {room.room_type}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2 text-center">
                    {room.price.toLocaleString()} {hotel.currency || 'VND'}
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

              <MoreRoomRates
                items={hotel.room_rate}
                currency={hotel.currency}
                limit={10}
              />
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
