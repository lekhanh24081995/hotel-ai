import React from 'react';
import ScrollTextAnimation from '../ScrollTextAnimation';
import { cn } from '@/app/lib/utils/common';

type Props = {
  className?: string;
};
export default function Heading({ className }: Props) {
  return (
    <h1
      className={cn(
        'hidden items-center gap-1 font-bold md:flex md:text-lg',
        className
      )}
    >
      Chat with
      <div className="relative w-20 overflow-hidden">
        <ScrollTextAnimation />
      </div>
    </h1>
  );
}
