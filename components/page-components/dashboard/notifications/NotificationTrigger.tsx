import { NotifIcon } from "@/components/icons/Location";
import { useCounts } from "@novu/react";

const NotificationTrigger = () => {
  const { counts } = useCounts({ filters: [{ read: false }] });
  const unreadCount = counts?.[0].count ?? 0;
  return (
    <button
      className="relative w-8 h-8 flex items-center justify-center"
      aria-label="Notifications"
    >
      <NotifIcon />

      {unreadCount ? (
        <span className="absolute top-0 right-0 w-3 text-[10px] h-3 flex items-center justify-center bg-[#91C152] rounded-full"></span>
      ) : (
        <></>
      )}
    </button>
  );
};

export default NotificationTrigger;
