'use client';

import ChatSuggestion from '../ChatSuggestion';
import ChatHotelList from '../ChatHotelList';
import { BotMessage } from '../message';

interface ListHotelsProps {
  route: string[];
}

const ChatHotel = ({ route }: ListHotelsProps) => {
  return (
    <div className="grid gap-4">
      <BotMessage
        showAvatar={false}
        showAction={false}
        content={`Here is the list of hotels based on your route destinations:\n${route.join(', ')}`}
      />

      <div>
        {route.map((city, index) => {
          return (
            <div
              className="grid gap-4 py-6 first:pt-0 last:pb-0"
              key={city + index}
            >
              <h1 className="text-2xl font-semibold">{city}</h1>
              <ChatHotelList city={city} />
            </div>
          );
        })}
      </div>

      <ChatSuggestion />
    </div>
  );
};

export default ChatHotel;
