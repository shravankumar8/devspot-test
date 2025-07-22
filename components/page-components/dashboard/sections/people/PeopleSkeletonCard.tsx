import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PeopleCardSkeleton = (): JSX.Element => {
  return (
    <Card className="flex font-roboto flex-col rounded-xl overflow-hidden border-2 border-solid border-[#2b2b31]">
      <div className="flex items-center gap-3 px-4 py-3 bg-secondary-bg">
        {/* Skeleton for Avatar */}
        <Skeleton className="w-[72px] h-[72px] rounded-full" />

        <div className="flex flex-col items-start gap-0.5">
          {/* Skeleton for name */}
          <Skeleton className="h-6 w-32 mb-1" />

          {/* Skeleton for title */}
          <Skeleton className="h-5 w-28 mb-1" />

          {/* Skeleton for location */}
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col items-start gap-3 !px-4 !py-3 bg-primary-bg">
        {/* Skeleton for skills badges */}
        <div className="flex items-center gap-3 flex-wrap w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-16 rounded-2xl" />
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-end justify-between self-stretch w-full">
          <div className="flex items-center gap-1">
            {/* Skeleton for token badge */}
            <Skeleton className="h-8 w-20 rounded-2xl" />

            {/* Skeleton for projects badge */}
            <Skeleton className="h-8 w-24 rounded-2xl" />
          </div>

          {/* Skeleton for button (uncomment if needed) */}
          {/* <Skeleton className="h-9 w-24 rounded-lg" /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeopleCardSkeleton;
