'use client';

import { useQuery } from '@tanstack/react-query';
import ChatSuggestion from '../ChatSuggestion';
import {
  requestGetHotelDetail,
  requestSearchHotels
} from '@/app/lib/services/hotels';
import HotelDetail from '../HotelDetail';
import { BotMessage } from '../message';
import { usePathname } from 'next/navigation';

type Props = {
  name: string;
};

const ChatHotelDetail = ({ name }: Props) => {
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ['hotels', name, pathname],
    queryFn: () =>
      requestSearchHotels({
        english_name: name
      })
  });

  if (!data) return;

  const hotel = data?.data.items[0];

  if (!hotel) return;

  return (
    <div className="grid gap-4">
      <BotMessage
        showAvatar={false}
        showAction={false}
        content={`Here are the details for the hotel: ${hotel.vietnamese_name}`}
      />

      <HotelDetail hotel={hotel} />

      <ChatSuggestion />
    </div>
  );
};

export default ChatHotelDetail;
