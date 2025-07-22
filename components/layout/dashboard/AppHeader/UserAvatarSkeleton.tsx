import { Skeleton } from "@/components/ui/skeleton";
import { FaChevronDown } from "react-icons/fa";

const UserAvatarSkeleton = () => {
  return (
    <div className="flex gap-3 md:w-60 items-center py-1 px-3 rounded-xl">
      <Skeleton className="w-12 h-9 rounded-full" />

      <div className="flex items-center justify-between w-full">
        <div className="md:flex hidden flex-col items-start gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-2 w-20" />
        </div>

        <div className="text-muted-foreground/20">
          <FaChevronDown size={18} className="animate-pulse text-neutral-800" />
        </div>
      </div>
    </div>
  );
};

export default UserAvatarSkeleton;
