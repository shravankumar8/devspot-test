interface PrizeAllocationSectionSkeletonProps {
  isOwner?: boolean;
  memberCount?: number;
}

import { AllocationCardSkeleton } from "./AllocationCardSkeleton";

export const PrizeAllocationSectionSkeleton = ({
  isOwner = false,
  memberCount = 3,
}: PrizeAllocationSectionSkeletonProps) => {
  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-3">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-700/50 rounded-md w-32 animate-pulse" />
        {isOwner && (
          <div className="h-8 w-8 bg-gray-700/50 rounded-full animate-pulse" />
        )}
      </div>

      {/* Grid of allocation cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,300px),1fr))] gap-8">
        {Array.from({ length: memberCount }).map((_, index) => (
          <AllocationCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
