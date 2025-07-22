import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="relative w-full p-5 gap-4 sm:gap-8 bg-secondary-bg rounded-[20px] flex items-end justify-between h-[236px]">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-7">
        <div className="relative">
          <Skeleton className="w-[120px] h-[120px] rounded-full" />
          <Skeleton className="absolute bottom-0 right-0 w-6 h-6 rounded-xl" />
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex items-center text-white font-raleway text-[32px] font-semibold gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-10 w-20" />
      </div>

      <Skeleton className="w-8 h-8 absolute top-4 right-4 rounded-2xl" />
    </div>
  );
}
