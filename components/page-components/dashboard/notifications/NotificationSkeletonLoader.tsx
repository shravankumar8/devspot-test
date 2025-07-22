import { Skeleton } from "@/components/ui/skeleton";

const NotificationSkeletonLoader = () => {
  return (
    <div
      className="px-1 py-2 pb-4 flex items-start gap-2 hover:bg-[#13131A] cursor-pointer transition-all duration-200 ease-in-out rounded-lg relative"
    >
      <div className="mx-2">
        {/* Skeleton for the icon */}
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="flex flex-col gap-3 w-[80%]">
        {/* Skeleton for the notification text */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Skeleton for potential action button (optional) */}
        <Skeleton className="h-9 w-24 mt-1" />
      </div>

      {/* Skeleton for the unread indicator (optional) */}
      <Skeleton className="w-2 h-2 rounded-full absolute right-3 top-3" />
    </div>
  );
};

export default NotificationSkeletonLoader;
