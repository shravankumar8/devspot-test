import { Skeleton } from "@/components/ui/skeleton";

export default function TechnologiesSkeleton() {
  return (
    <div className="col-span-12 md:col-span-4 h-auto md:min-h-[564px] rounded-2xl border border-tertiary-bg bg-secondary-bg p-6">
      <div className="grid grid-cols-12">
        <div className="col-span-6">
          <h6 className="text-secondary-text">Technologies</h6>
        </div>
        <div className="col-span-3">
          <h6 className="text-secondary-text">Uses</h6>
        </div>
        <div className="col-span-3">
          <h6 className="text-secondary-text">Projects</h6>
        </div>
      </div>

      <div className="h-[500px] overflow-y-scroll mt-5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="grid grid-cols-12 mt-3">
            <div className="col-span-6">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </div>
            <div className="col-span-3">
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="col-span-3">
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
