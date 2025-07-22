import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuthStore } from "@/state";
import { NovuProvider } from "@novu/react";
import { useMemo } from "react";
import NotificationList from "./NotificationList";
import NotificationTrigger from "./NotificationTrigger";

const Notifications = () => {
  const { user } = useAuthStore();
  const isMobile = useIsMobile();

  const subscriberId = useMemo(() => {
    return user?.id ?? process.env.NEXT_PUBLIC_NOVU_SUBSCRIBER_ID!;
  }, [user?.id]);

  const applicationIdentifier =
    process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER!;

  return (
    <NovuProvider
      subscriberId={subscriberId}
      applicationIdentifier={applicationIdentifier}
    >
      <Popover>
        <PopoverTrigger asChild>
          <div>
            <NotificationTrigger />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 border-none w-full"
          side={isMobile ? "bottom" : "left"}
          align="start"
        >
          <NotificationList />
        </PopoverContent>
      </Popover>
    </NovuProvider>
  );
};

export default Notifications;
