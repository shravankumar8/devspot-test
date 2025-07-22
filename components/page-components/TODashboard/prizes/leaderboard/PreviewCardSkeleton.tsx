import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/tailwind-merge";

const PreviewCardSkeleton = (): JSX.Element => {
  return (
    <Card
      className={cn(
        "rounded-xl min-w-[286px] border-2 border-solid border-[#2b2b31] font-roboto flex flex-col"
      )}
    >
      <CardHeader className="flex flex-col gap-3 space-y-0 bg-secondary-bg !px-4 !py-3 rounded-t-xl">
        <div className="flex items-end gap-3 w-full">
          <div className="w-[76px] h-[76px] min-w-[76px] flex-shrink-0 bg-primary-bg border-2 border-tertiary-bg rounded-[12px]">
            <Skeleton className="w-full h-full rounded-[12px]" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="w-[70%] h-[16px] rounded-md" />
            <Skeleton className="w-[50%] h-[14px] rounded-md" />
          </div>
        </div>
        <div className="flex justify-end w-full">
          <Skeleton className="w-[80px] h-[28px] rounded-full" />
        </div>
      </CardHeader>

      <Separator className="bg-tertiary-bg h-0.5" />

      <CardContent className="flex flex-col justify-between gap-4 bg-primary-bg !p-4 rounded-b-xl">
        <Skeleton className="w-full h-[116px] rounded-md" />
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-[100px] h-[12px] rounded-md" />
          </div>
          <Skeleton className="w-[50px] h-6 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewCardSkeleton;
