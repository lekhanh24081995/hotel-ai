import React from 'react';
import { cn } from '../../lib/utils/common';

type Props = {
  show: boolean;
  onSendMessage: (message: string) => Promise<void>;
};
export default function ExampleMessages({ show, onSendMessage }: Props) {
  const exampleMessages = [
    {
      heading: 'Chương trình du lịch',
      subheading: 'Phú Quốc - Bình Thuận - Quảng Ninh',
      message: `Tôi muốn chương trình du lịch Phú Quốc - Bình Thuận - Quảng Ninh trong 5 ngày/4 đêm, khách sạn 4 sao?`
    },
    {
      heading: 'Hiển thị bản đồ du lịch',
      subheading: 'của tuyến du lịch\nPhú Quốc - Bình Thuận - Quảng Ninh',
      message:
        'Hiển thị bản đồ cho tuyến du lịch Phú Quốc - Bình Thuận - Quảng Ninh'
    }
  ];

  return (
    <>
      {show && (
        <div className="mx-auto mb-4 grid max-w-2xl gap-2 px-6 sm:grid-cols-2 sm:gap-4">
          {exampleMessages.map((example, index) => (
            <div
              key={example.heading}
              className={cn(
                'cursor-pointer rounded-2xl bg-zinc-50 p-4 text-zinc-950 transition-colors hover:bg-zinc-100 sm:p-6',
                index > 1 && 'hidden md:block'
              )}
              onClick={() => onSendMessage(example.message)}
            >
              <div className="font-medium">{example.heading}</div>
              <div className="text-sm text-zinc-800">{example.subheading}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
