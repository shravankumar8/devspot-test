"use client";

import { Button } from "@/components/ui/button";
import { Notification, useNotifications, useNovu } from "@novu/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { categorizeNotifications } from "./categorizeNotifications";
import NotificationItem from "./NotificationItem";
import NotificationSkeletonLoader from "./NotificationSkeletonLoader";

const NotificationList = () => {
  const novu = useNovu();

  const { notifications, error, isLoading, isFetching, hasMore, refetch } =
    useNotifications();

  useEffect(() => {
    novu.on("notifications.notification_received", refetch);
    return () => {
      novu.off("notifications.notification_received", refetch);
    };
  }, [novu, refetch]);

  if (isLoading) return <NotificationSkeletonLoader />;
  if (error) return <div>Error: {error.message}</div>;

  const categorizedNotifications = categorizeNotifications(notifications ?? []);

  return (
    <div className="!z-50 flex flex-col gap-3 bg-secondary-bg shadow-[0_0_6px_rgba(19,19,26,0.25)] p-4 border border-[#2b2b31] rounded-[12px] w-screen md:w-[472px] !font-roboto">
      <div className="pb-3 border-[#2B2B31] border-b-2">
        <h2 className="font-semibold text-white text-xl">Notifications</h2>
      </div>

      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
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
                <div key={key}>
                  <div className="mb-3 font-medium text-[#89898c] text-xs uppercase">
                    {key}
                  </div>

                  <div className="flex flex-col gap-5">
                    {isFetching && <NotificationSkeletonLoader />}
                    {notificationList?.map((notification: Notification) => (
                      <NotificationItem
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
            <p className="text-[#89898c]">No notifications</p>
          </div>
        )}
      </div>

      {notifications?.length !== undefined && notifications?.length > 0 && (
        <Link
          href="/notifications"
          className="flex justify-end items-center gap-2 font-roboto text-sm"
        >
          <Button
            variant="tertiary"
            size="lg"
            className="font-medium !text-base"
          >
            View all
          </Button>

          <ArrowRight className="w-6 h-6" color="#4E52F5" />
        </Link>
      )}
    </div>
  );
};

export default NotificationList;
