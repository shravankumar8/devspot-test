import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton = (): JSX.Element => {
  return (
    <Card className="h-[410px] rounded-xl overflow-hidden border-2 border-solid border-[#2b2b31] font-roboto flex flex-col">
      <CardHeader className="flex flex-col items-end justify-between space-y-0 gap-3 !py-3 !px-4 bg-secondary-bg">
        <div className="flex items-end gap-3">
          <Skeleton className="w-[72px] h-[72px] rounded-md" />

          <div className="flex flex-col items-start gap-0.5">
            <Skeleton className="h-7 w-32 mb-1" />

            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full h-[45px]">
          <div className="flex items-center flex-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`relative w-[40px] h-[40px] ${
                  index > 0 ? "-ml-2" : "ml-[-1.00px]"
                } z-[${3 - index}]`}
              >
                <Skeleton className="absolute w-[40px] h-[40px] rounded-full" />
              </div>
            ))}

            <Skeleton className="w-[40px] h-[40px] rounded-full -ml-2" />
          </div>

        </div>
      </CardHeader>

      <Separator className="h-0.5 bg-tertiary-bg" />

      <CardContent className="flex flex-col h-[244px] items-start justify-between !p-4 bg-primary-bg gap-4">
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-16 rounded-2xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCardSkeleton;
