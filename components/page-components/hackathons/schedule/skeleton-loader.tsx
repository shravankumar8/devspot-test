"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const HackathonScheduleSkeleton = () => {
  return (
    <div className="">
      {/* Calendar and upcoming events section */}
      <div className="my-4 md:flex-row flex-col flex gap-4 w-full">
        {/* Calendar skeleton */}
        <div className="w-full md:w-1/2 h-[350px] rounded-[12px] overflow-hidden">
          <Skeleton className="w-full h-full bg-secondary-bg/30" />
        </div>

        {/* Right side cards */}
        <div className="w-full md:w-1/2 space-y-4">
          {/* Happening now card skeleton */}
          <div className="bg-secondary-bg/30 p-4 rounded-[12px] space-y-4">
            <Skeleton className="w-32 h-6 rounded-[16px]" />
            <Skeleton className="w-48 h-4 rounded-md" />
            <Skeleton className="w-full h-10 rounded-[16px]" />
          </div>

          {/* Up next card skeleton */}
          <div className="bg-secondary-bg/30 p-4 rounded-[12px] space-y-4">
            <Skeleton className="w-24 h-6 rounded-[16px]" />
            <Skeleton className="w-40 h-4 rounded-md" />
            <Skeleton className="w-3/4 h-6 rounded-md" />
          </div>
        </div>
      </div>

      {/* Schedule list skeleton */}
      <div className="space-y-8 px-4">
        {/* Generate 3 days of skeleton schedule */}
        {[1, 2, 3].map((day) => (
          <div
            key={day}
            className="space-y-4 flex justify-between items-start border-t border-t-[#424248] pt-4 lg:flex-row flex-col"
          >
            {/* Day header skeleton */}
            <div className="basis-[30%] space-y-2">
              <Skeleton className="w-16 h-8 rounded-md" />
              <Skeleton className="w-32 h-6 rounded-md" />
            </div>

            {/* Events skeleton */}
            <div className="space-y-4 basis-[70%] w-full">
              {/* Generate 2-3 events per day */}
              {Array(2 + (day % 2))
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-secondary-bg/30 p-4 rounded-[12px] space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <Skeleton className="w-32 h-5 rounded-md" />
                      <Skeleton className="w-24 h-5 rounded-md" />
                    </div>
                    <Skeleton className="w-3/4 h-6 rounded-md" />
                    <div className="flex gap-2">
                      <Skeleton className="w-24 h-8 rounded-[16px]" />
                      <Skeleton className="w-24 h-8 rounded-[16px]" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
