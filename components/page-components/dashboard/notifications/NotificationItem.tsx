import { UserSvg } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { Notification } from "@novu/react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import DynamicActions, { NotificationType } from "./notificationTypes";

interface NovuRedirect {
  url: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop";
}

const NotificationItem = ({ notification }: { notification: Notification }) => {
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
      className="px-1 py-2 pb-4 flex items-start gap-2 cursor-pointer transition-all duration-200 ease-in-out rounded-lg relative"
      onClick={handleNotificationClick}
    >
      <div className="mx-2">
        {notification.avatar ? (
          <UserSvg
            width={32}
            height={32}
            className="w-8 text-main-primary h-8"
          />
        ) : (
          <Bell className="h-6 w-6 text-[#4e52f5]" />
        )}
      </div>

      <div className="flex flex-col gap-3 w-[80%]">
        <p
          className="text-sm text-white font-medium"
          dangerouslySetInnerHTML={{ __html: notification.body }}
        ></p>

        <div onClick={() => notification.read()}>
          {notification.data && (
            <DynamicActions
              {...(notification.data as unknown as NotificationType)}
            />
          )}
        </div>

        {notification?.primaryAction && (
          <Button
            type="button"
            size="md"
            onClick={handlePrimaryActionClick}
            className="w-fit"
          >
            {notification.primaryAction?.label}
          </Button>
        )}
      </div>

      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-[#91C152] absolute right-3 top-3"></div>
      )}
    </div>
  );
};

export default NotificationItem;
