import { cn } from "@/utils/tailwind-merge";

interface AboutSectionSkeletonProps {
  isOwner?: boolean;
  hasVideo?: boolean;
}

export const AboutSectionSkeleton = ({
  isOwner = false,
  hasVideo = true,
}: AboutSectionSkeletonProps) => {
  return (
    <div
      className={cn(
        "bg-secondary-bg rounded-[12px] py-4 px-5 font-roboto space-y-2 flex flex-col gap-3",
        hasVideo ? "col-span-1" : "col-span-2",
        hasVideo && "min-h-[200px]"
      )}
    >
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-700/50 rounded-md w-16 animate-pulse" />
        {isOwner && (
          <div className="h-8 w-8 bg-gray-700/50 rounded-full animate-pulse" />
        )}
      </div>

      {/* Content placeholder - multiple lines */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-700/50 rounded-md w-full animate-pulse" />
        <div className="h-4 bg-gray-700/50 rounded-md w-full animate-pulse" />
        <div className="h-4 bg-gray-700/50 rounded-md w-3/4 animate-pulse" />
      </div>

      {/* View more button placeholder */}
      <div className="h-4 bg-gray-700/50 rounded-md w-24 animate-pulse mt-2" />
    </div>
  );
};
