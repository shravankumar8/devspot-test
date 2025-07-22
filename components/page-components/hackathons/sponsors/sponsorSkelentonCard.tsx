import { cn } from "@/utils/tailwind-merge";

interface SkeletonCardProps {
  type: "sponsor" | "community-partner";
}
export const SponsorCardSkeleton = ({ type }: SkeletonCardProps) => {
  return (
    <div className="overflow-hidden sponsor-border relative rounded-xl h-[180px] flex-col items-center justify-center py-6 animate-pulse">
      {/* Background shimmer effect */}
      <div className="absolute inset-0 z-0  bg-[length:200%_100%] animate-pulse" />

      {/* Arrow skeleton */}
      <div className="absolute top-2 right-2 z-10">
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col gap-3 items-center justify-center h-full">
        {/* Tier badge skeleton */}
        <div className="h-6 px-2 rounded-2xl bg-gray-300 w-16 animate-pulse" />

        {/* Logo container skeleton */}
        <div
          className={cn(
            "h-[55px] flex items-center justify-center ",
            type == "sponsor" ? "w-[172px]" : 'w-[86px]"'
          )}
        >
          <div className="w-full h-full bg-gray-300 rounded animate-pulse" />
        </div>

        {/* Price skeleton */}
        <div className="h-5 w-24 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  );
};
