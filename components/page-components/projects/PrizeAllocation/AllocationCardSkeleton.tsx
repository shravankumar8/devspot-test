import { cn } from "@/utils/tailwind-merge";

interface AllocationCardSkeletonProps {
  className?: string;
}

export const AllocationCardSkeleton = ({
  className,
}: AllocationCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "flex flex-col p-3 pr-7 bg-secondary-bg border-tertiary-bg border-[2px] rounded-[12px] max-w-[380px]",
        className
      )}
    >
      {/* User avatar and name */}
      <div className="flex items-center gap-3 mb-1">
        {/* Avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-gray-700/50 animate-pulse" />

        {/* Name placeholder */}
        <div className="h-5 bg-gray-700/50 rounded-md w-32 animate-pulse" />
      </div>

      {/* Roles tags */}
      <div className="flex gap-3 mb-6">
        <div className="h-8 bg-gray-700/50 rounded-full w-16 animate-pulse" />
        <div className="h-8 bg-gray-700/50 rounded-full w-20 animate-pulse" />
      </div>

      {/* Progress bar section */}
      <div className="relative w-full mt-6">
        {/* Percentage label placeholder */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="h-6 w-12 bg-gray-700/50 rounded-full animate-pulse" />
        </div>

        {/* Progress bar placeholder */}
        <div className="w-full h-2 rounded-full bg-gray-700/50 animate-pulse" />

        {/* Thumb placeholder */}
        <div className="absolute w-5 h-5 rounded-full bg-gray-700/50 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};
