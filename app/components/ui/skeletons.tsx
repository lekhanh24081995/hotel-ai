import clsx from 'clsx';

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const HotelListSkeleton = () => {
  return (
    <div className={clsx(`${shimmer} container mx-auto px-4 pb-8 md:block`)}>
      <div className="rounded bg-white shadow-md">
        <div className="flex flex-col">
          <div className="my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-5">
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                </div>
                {/* Repeat this div structure for each row placeholder */}
                <div className="hidden grid-cols-1 gap-4 p-4 md:grid lg:grid-cols-5">
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                </div>
                {/* Repeat this div structure for each row placeholder */}
                <div className="hidden grid-cols-1 gap-4 p-4 md:grid lg:grid-cols-5">
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                </div>
                {/* Repeat this div structure for each row placeholder */}
                <div className="hidden grid-cols-1 gap-4 p-4 md:grid lg:grid-cols-5">
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                  <div className="h-20 w-full rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
