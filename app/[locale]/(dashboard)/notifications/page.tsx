"use client"

import NotificationsPageComponent from "@/components/page-components/dashboard/notifications/notificationPage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/state";
import { NovuProvider } from "@novu/react";
import { useMemo } from "react";


const NotificationsPage = () => {
  const { user } = useAuthStore();

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
      <NotificationsPageComponent/>
    </NovuProvider>
  );
};

export default NotificationsPage;
