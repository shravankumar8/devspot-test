import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/tailwind-merge";


export const NavItemSkeleton = ({ isOpen = true }: { isOpen?: boolean }) => {
  return (
    <div
      className={cn(
        "transition-all duration-200 pl-5 ease-in-out py-2 flex items-center gap-2",
        isOpen ? "flex" : "hidden md:flex"
      )}
    >
      {/* Active indicator skeleton - hidden since we don't know active state */}
      <div className="h-[28px] left-2 absolute bg-transparent rounded-tr-lg rounded-br-lg w-0" />

      {/* Icon skeleton */}
      <div className="size-5">
        <Skeleton className="w-5 h-5 bg-gray-600" />
      </div>

      {/* Label skeleton */}
      <Skeleton className="lg:block md:hidden block h-4 w-16 bg-gray-600" />
    </div>
  );
};
