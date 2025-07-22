import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/tailwind-merge";


const TechnologyOwnersCardSkeleton = (): JSX.Element => {
  return (
    <Card
      className={cn(
        "flex relative font-roboto flex-col rounded-xl overflow-hidden border-2 border-solid border-[#2b2b31]"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-secondary-bg">
        {/* Avatar Skeleton */}
        <Skeleton className="w-[124px] h-[124px] border-2 border-tertiary-bg rounded-[12px] bg-gray-700" />

        <div className="flex flex-col justify-between h-[124px] items-start">
          {/* Upcoming hackathons badge skeleton */}
          <div>
            <Skeleton className="h-6 w-32 rounded-[16px] bg-gray-700" />
          </div>

          {/* Name and domain skeleton */}
          <div className="flex flex-col items-start gap-0.5">
            <Skeleton className="h-6 w-40 bg-gray-700" />
            <Skeleton className="h-5 w-28 bg-gray-700" />
          </div>
        </div>
      </div>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col items-start gap-3 !px-4 !py-3 bg-primary-bg">
        <div className="w-full">
          {/* Tagline skeleton - multiple lines */}
          <Skeleton className="h-4 w-full bg-gray-700 mb-2" />
          <Skeleton className="h-4 w-3/4 bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologyOwnersCardSkeleton;
