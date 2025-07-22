import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const SkillAndTechnologySkeletonLoader = () => {
  return (
    <>
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-20 rounded-2xl" />
        ))}
      </div>
      <Separator className="h-0.5 bg-[#424248]" />
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-24 rounded-2xl" />
        ))}
      </div>
    </>
  );
};

export default SkillAndTechnologySkeletonLoader;
