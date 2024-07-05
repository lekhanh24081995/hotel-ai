import HotelDetailWrapper from '@/app/components/HotelDetailWrapper';
import HotelList from '@/app/components/HotelList';
import Search from '@/app/components/Search';
import SelectEntries from '@/app/components/SelectEntries';
import { HotelListSkeleton } from '@/app/components/ui/skeletons';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { Suspense } from 'react';

type Props = {
  searchParams: {
    [key: string]: string | string[] | undefined;
    page?: string;
    _id: string;
  };
};

export default async function Hotel({ searchParams }: Props) {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="container mx-auto flex flex-col justify-between gap-4 px-4 py-4 md:py-8 lg:flex-row lg:items-end">
        <SelectEntries />

        <div className="relative flex-1 lg:max-w-md">
          <Search className="pr-10" />
          <MagnifyingGlassIcon className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <Suspense fallback={<HotelListSkeleton />}>
        <HotelList searchParams={searchParams} />
      </Suspense>

      <Suspense>
        <HotelDetailWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
