import { cn } from "@/utils/tailwind-merge";

const SkeletonCell = () => (
  <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
);

const ParticipantsTableSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-5">
      <div className="border border-tertiary-bg font-roboto overflow-x-scroll">
        {/* Skeleton Table Rows */}
        <div className="divide-y divide-tertiary-bg h-[450px] overflow-y-scroll">
          {Array.from({ length: 8 }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className={cn(
                "px-6 py-4 grid grid-cols-6 gap-4 items-center text-sm",
                rowIdx % 2 === 0 ? "bg-transparent" : "bg-secondary-bg"
              )}
            >
              {Array.from({ length: 10 }).map((_, colIdx) => (
                <div key={colIdx} className="basis-[16.7%]">
                  <SkeletonCell />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <div className="text-white text-sm py-4 px-3 border-t border-t-tertiary-bg">
          <div className="h-4 w-36 bg-gray-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ParticipantsTableSkeleton;
