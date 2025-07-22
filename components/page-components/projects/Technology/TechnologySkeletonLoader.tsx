import { cn } from "@/utils/tailwind-merge";

interface TechnologiesSectionSkeletonProps {
  isOwner?: boolean;
}

export const TechnologiesSectionSkeleton = ({
  isOwner = false,
}: TechnologiesSectionSkeletonProps) => {
  return (
    <div className="bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-3">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-700/50 rounded-md w-28 animate-pulse" />
        {isOwner && (
          <div className="h-8 w-8 bg-gray-700/50 rounded-full animate-pulse" />
        )}
      </div>

      {/* Technologies tags placeholder */}
      <div className="flex flex-wrap gap-2">
        {/* Generate multiple placeholder tags of different widths */}
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className={cn(
              "h-6 bg-gray-700/50 rounded-full animate-pulse",
              index % 3 === 0 ? "w-16" : index % 3 === 1 ? "w-24" : "w-20"
            )}
          />
        ))}
      </div>
    </div>
  );
};
