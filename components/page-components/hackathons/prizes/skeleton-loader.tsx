"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const HackathonPrizesSkeleton = () => {
  // Create an array of challenge groups with varying numbers of prizes
  const challengeGroups = [
    { id: 1, prizeCount: 3 },
    { id: 2, prizeCount: 2 },
    { id: 3, prizeCount: 4 },
  ];

  return (
    <div>
      <div className="space-y-10">
        {challengeGroups.map((group) => (
          <div key={group.id} className="space-y-3">
            {/* Challenge name skeleton */}
            <Skeleton className="h-8 w-64 rounded-md" />

            {/* Prize cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array(group.prizeCount)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-secondary-bg/30 rounded-lg p-4 space-y-4"
                  >
                    {/* Prize position and sponsor */}
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-8 w-16 rounded-md" />{" "}
                      {/* Position */}
                      <Skeleton className="h-10 w-20 rounded-md" />{" "}
                      {/* Sponsor logo */}
                    </div>

                    {/* Prize title */}
                    <Skeleton className="h-6 w-3/4 rounded-md" />

                    {/* Prize amount */}
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-1/2 rounded-md" />{" "}
                      {/* Cash prize */}
                      <Skeleton className="h-5 w-2/3 rounded-md" />{" "}
                      {/* Token prize */}
                    </div>

                    {/* Custom prize or description */}
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
