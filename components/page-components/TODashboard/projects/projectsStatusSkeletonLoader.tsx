import { Skeleton } from "@/components/ui/skeleton";

export default function BarChartSkeleton() {
  return (
    <div className="flex flex-row sm:flex-col md:flex-row gap-4 w-full items-center justify-evenly flex-wrap">
      {/* Bar Chart Skeleton */}
      <div className="h-[250px] w-full max-w-[280px] flex-shrink-0 flex items-end justify-center gap-2 p-4">
        {/* Simulate multiple bars with different heights */}
        <Skeleton className="w-8 h-20" />
        <Skeleton className="w-8 h-16" />
        <Skeleton className="w-8 h-24" />
        <Skeleton className="w-8 h-12" />
        <Skeleton className="w-8 h-18" />
      </div>

      {/* Legend Skeleton */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-2 pr-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-white text-sm"
          >
            <Skeleton className="w-3 h-3 rounded-sm flex-shrink-0" />
            <Skeleton className="h-4 w-full max-w-[100px]" />
          </div>
        ))}

        {/* Total Count Skeleton */}
        <div className="flex items-center gap-2 text-white text-sm mt-2">
          <span className="w-3 h-3 rounded-sm opacity-0" /> {/* Spacer */}
          <div className="flex items-center gap-1">
            <span>Total:</span>
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
