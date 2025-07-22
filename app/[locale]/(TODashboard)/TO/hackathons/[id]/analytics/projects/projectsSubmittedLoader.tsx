import { Skeleton } from "@/components/ui/skeleton";

export default function ChallengesSkeleton() {
  return (
    <div className="col-span-12 md:col-span-4 h-auto md:min-h-[564px] rounded-2xl border border-tertiary-bg bg-secondary-bg p-6">
      <h4 className="font-semibold font-roboto">
        Projects Submitted per Challenge
      </h4>

      <div className="mt-5 h-[500px] overflow-y-scroll">
        <ul className="flex flex-col gap-7">
          {Array.from({ length: 6 }).map((_, idx) => (
            <li key={idx} className="flex gap-6 items-center">
              <div className="flex-shrink-0">
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-full max-w-[180px] mb-2" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-4" />
                  <span className="text-secondary-text text-sm">/</span>
                  <Skeleton className="h-3 w-4" />
                  <span className="text-secondary-text text-sm">Projects</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
