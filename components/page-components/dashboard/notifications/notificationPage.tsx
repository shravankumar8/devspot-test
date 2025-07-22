"use client";

import { categorizeNotifications } from "@/components/page-components/dashboard/notifications/categorizeNotifications";
import NotificationSkeletonLoader from "@/components/page-components/dashboard/notifications/NotificationSkeletonLoader";
import { Button } from "@/components/ui/button";
import { useNotifications, useNovu } from "@novu/react";
import { useEffect } from "react";
import NotificationPageItem from "./notificationPageItem";

export default function NotificationsPageComponent() {
  const {
    notifications,
    error,
    isLoading,
    isFetching,
    hasMore,
    refetch,
    archiveAll,
  } = useNotifications();

  const novu = useNovu();

  useEffect(() => {
    // Refresh when a new notification arrives
    novu.on("notifications.notification_received", refetch);

    return () => {
      novu.off("notifications.notification_received", refetch);

      // 🔥 On unmount, mark unread notifications as read
      if (notifications) {
        notifications?.filter((n) => !n.isRead).forEach((n) => n.read?.()); // Use optional chaining in case read is undefined
      }
    };
  }, [novu, refetch, notifications]);

  const categorizedNotifications = categorizeNotifications(notifications ?? []);

  const handleClearAll = () => {
    if (!notifications || notifications.length === 0) return;
    archiveAll();
  };

  return (
    <main className="w-full sm:px-3 sm:py-1 min-h-[calc(100vh-82px)]">
      <div className="w-full flex justify-between items-center pb-4">
        <h1
          className="text-[28px] font-bold leading-[30px]
"
        >
          Notifications
        </h1>
        <div>
          <Button
            disabled={notifications?.length === 0}
            variant="tertiary"
            className="w-fit"
            size="sm"
            onClick={handleClearAll}
          >
            Clear all
          </Button>
        </div>
      </div>

      <div className="w-full h-[2px] bg-[#2B2B31] rounded-[20px] mb-5"></div>

      <div className="font-roboto">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <NotificationSkeletonLoader key={index} />
          ))}

        {!isLoading &&
          notifications?.length !== 0 &&
          Object.entries(categorizedNotifications).map(
            ([key, notificationList]) => {
              if (notificationList.length === 0) return null;

              return (
                <div key={key} className="mb-5">
                  <div className="mb-4 text-sm font-medium text-secondary-text uppercase">
                    {key}
                  </div>

                  <div className="flex flex-col gap-4">
                    {isFetching && <NotificationSkeletonLoader />}
                    {notificationList?.map((notification) => (
                      <NotificationPageItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </div>
                </div>
              );
            }
          )}

        {notifications?.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-[#89898c] font-roboto text-sm">
              No notifications
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
