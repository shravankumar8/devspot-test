import { Skeleton } from "@/components/ui/skeleton";

export default function ChartSkeleton() {
  return (
    <div className="flex flex-row sm:flex-col md:flex-row gap-4 w-full items-center justify-evenly flex-wrap">
      {/* Pie Chart Skeleton */}
      <div className="h-[250px] w-full max-w-[220px] flex-shrink-0 flex items-center justify-center">
        <Skeleton className="w-40 h-40 rounded-full" />
      </div>

      {/* Legend Skeleton */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-2 pr-4 max-h-[250px] overflow-y-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-white text-sm"
          >
            <Skeleton className="w-3 h-3 rounded-sm flex-shrink-0" />
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
