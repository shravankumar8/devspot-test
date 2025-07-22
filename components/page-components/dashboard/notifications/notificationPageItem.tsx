import { CheckIcon } from "@/components/icons/Star";
import { Button } from "@/components/ui/button";
import { Notification } from "@novu/react";
import { useRouter } from "next/navigation";
import DynamicActions, { NotificationType } from "./notificationTypes";

interface NovuRedirect {
  url: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop";
}

const NotificationPageItem = ({
  notification,
}: {
  notification: Notification;
}) => {
  const router = useRouter();

  const handleRedirect = (redirect: NovuRedirect) => {
    if (!redirect.url) return;
    const url = redirect?.url;
    const target = redirect?.target;

    if (target === "_self") {
      router.push(url);
    } else {
      window.open(url, target);
    }
  };

  const handleNotificationClick = () => {
    if (notification.redirect?.url) {
      handleRedirect(notification.redirect);
    }

    notification.read();
  };

  const handlePrimaryActionClick = () => {
    if (notification.primaryAction?.redirect?.url) {
      handleRedirect(notification.primaryAction?.redirect);
    }
  };

  return (
    <div
      className="py-3 px-5 w-full flex items-center md:items-start lg:items-center gap-2 bg-secondary-bg cursor-pointer transition-all duration-200 ease-in-out rounded-xl relative font-roboto justify-between small"
      onClick={handleNotificationClick}
    >
      <div className="flex gap-3 lg:items-center items-start">
        <div className="w-8 h-8 flex justify-center items-center">
          <CheckIcon width="24px" height="24px" />
        </div>
        <p
          className="text-sm text-white font-medium notif-message-sm "
          dangerouslySetInnerHTML={{ __html: notification.body }}
        ></p>
        {!notification.isRead && (
          <div className="w-2 h-2 notif-unread-sm rounded-full bg-[#91C152]"></div>
        )}
      </div>

      <div className="flex gap-2 items-start lg:items-center">
        {notification.data && (
          <DynamicActions
            {...(notification.data as unknown as NotificationType)}
          />
        )}

        <div className="flex gap-2 items-center sm:flex-nowrap flex-wrap notif-action-button">
          {notification?.primaryAction && (
            <Button
              type="button"
              size="sm"
              onClick={handlePrimaryActionClick}
              className="w-fit"
            >
              {notification.primaryAction?.label}
            </Button>
          )}
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 notif-unread rounded-full bg-[#91C152]"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationPageItem;
