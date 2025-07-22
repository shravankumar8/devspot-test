import { cn } from "@/utils/tailwind-merge";


export function HackathonResourcesSkeleton() {
  return (
    <div className="flex flex-col w-full gap-5 mt-5">
      {/* Search Bar Skeleton */}
      <div className="relative w-full">
        <div className="h-[40px] bg-secondary-bg animate-pulse rounded-md w-full" />
      </div>

      <div className="border border-tertiary-bg rounded-xl overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Filters Skeleton */}
          <div className="bg-secondary-bg rounded-t-xl flex items-center px-3 py-2 gap-5 min-w-full w-full overflow-x-scroll">
            <div className="basis-[25%]">
              <div className="h-5 w-20 bg-tertiary-bg animate-pulse rounded" />
            </div>
            {/* Filter Dropdown Skeletons */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="basis-[25%]">
                <div className="h-5 w-24 bg-tertiary-bg animate-pulse rounded" />
              </div>
            ))}
          </div>

          {/* Resource Rows Skeleton */}
          <div className="relative mt-2">
            <div className="flex flex-col">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`min-w-full w-full overflow-x-auto flex items-start gap-5 px-3 py-4 ${cn(
                    index % 2 === 0 ? "bg-transparent" : "bg-[#1B1B22]"
                  )}`}
                >
                  {/* Resource Title Skeleton */}
                  <div className="basis-[25%] flex gap-2 items-center">
                    <div className="h-4 w-32 bg-tertiary-bg animate-pulse rounded" />
                    <div className="h-4 w-4 bg-tertiary-bg animate-pulse rounded-full" />
                  </div>

                  {/* Type Icon Skeleton */}
                  <div className="flex gap-2 items-center basis-[25%]">
                    <div className="h-5 w-5 bg-tertiary-bg animate-pulse rounded" />
                  </div>

                  {/* Technologies Badges Skeleton */}
                  <div className="flex gap-2 items-center basis-[25%] flex-wrap">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-16 bg-[#2B2B31] animate-pulse rounded-2xl"
                      />
                    ))}
                  </div>

                  {/* Challenges Badges Skeleton */}
                  <div className="basis-[25%] flex gap-2 items-center flex-wrap">
                    <div className="h-6 w-20 bg-[#3400A8] animate-pulse rounded-2xl" />
                  </div>

                  {/* Sponsors Badges Skeleton */}
                  <div className="basis-[25%] flex items-center flex-wrap gap-2">
                    <div className="h-6 w-24 border border-tertiary-bg bg-transparent animate-pulse rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
