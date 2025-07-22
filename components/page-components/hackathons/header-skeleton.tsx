"use client";

export default function HackathonSkeleton() {
  return (
    <div
      className={`relative overlay w-full text-white gap-4 sm:gap-8 bg-secondary-bg rounded-[20px] flex items-center justify-between h-[240px] overflow-hidden`}
    >
      {/* Background skeleton */}
      <div className="absolute inset-0 w-full h-full bg-gray-800 animate-pulse" />

      <div className="flex w-full justify-between lg:flex-row flex-col gap-3 px-6 md:px-8 lg:items-center pb-8 z-10">
        <div className="flex gap-5">
          {/* Avatar skeleton (hidden on smaller screens) */}
          <div className="xl:block hidden w-[165px] h-[80px] bg-gray-700 rounded-md animate-pulse" />

          <div className="flex flex-col justify-between gap-3">
            {/* Hackathon name skeleton */}
            <div className="h-[46px] w-[250px] bg-gray-700 rounded-md animate-pulse" />

            <div className="flex gap-3">
              {/* Organizer logo skeleton */}
              <div className="w-[60px] h-[20px] bg-gray-700 rounded-md animate-pulse" />

              <div className="font-roboto">
                {/* Organizer label skeleton */}
                <div className="h-[13px] w-[80px] bg-gray-700 rounded-sm animate-pulse mb-2" />
                {/* Organizer name skeleton */}
                <div className="h-[16px] w-[120px] bg-gray-700 rounded-sm animate-pulse" />
              </div>
            </div>

            {/* Tags skeleton */}
            <div className="md:flex hidden gap-2">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="h-[24px] w-[60px] bg-gray-700 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:items-end lg:justify-end gap-8">
          {/* Action button/state skeleton */}
          <div className="h-[40px] w-[120px] bg-gray-700 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
