import { cn } from "@/utils/tailwind-merge";

interface HackathonRowSkeletonProps {
  count?: number;
}

export default function HackathonRowSkeleton({
  count = 10,
}: HackathonRowSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "min-w-full w-full flex items-center gap-5 px-3 py-4 animate-pulse",
            index % 2 === 0 ? "bg-transparent" : "bg-gray-900" // Using a darker background for even rows to match the original's alternating background
          )}
        >
          {/* Hackathon Info */}
          <div className="flex items-center gap-3 basis-[25%]">
            <div className="w-10 h-10 rounded-lg bg-gray-700" />
            <div className="h-4 w-3/4 rounded bg-gray-700" />
          </div>
          {/* Location */}
          <div className="flex items-center gap-1 basis-[15%]">
            <div className="h-4 w-1/2 rounded bg-gray-700" />
          </div>
          {/* Dates */}
          <div className="basis-[20%]">
            <div className="h-4 w-2/3 rounded bg-gray-700" />
          </div>
          <div className="basis-[20%]">
            <div className="h-4 w-2/3 rounded bg-gray-700" />
          </div>
          {/* Sign ups */}
          <div className="basis-[10%]">
            <div className="h-4 w-1/3 rounded bg-gray-700" />
          </div>
          {/* Status */}
          <div className="basis-[15%]">
            <div className="h-6 w-20 rounded-full bg-gray-700" />
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 basis-[15%]">
            <div className="w-8 h-8 rounded-full bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-gray-700" />
          </div>
        </div>
      ))}
    </>
  );
}
