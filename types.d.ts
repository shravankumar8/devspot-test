import { NotificationType } from "./components/page-components/dashboard/notifications/notificationTypes";

declare global {
  interface NotificationData extends NotificationType {}
  interface Window {
    twq?: {
      // Base configuration
      (method: "config", pixelId: string): void;
      // Event tracking
      (
        method: "track",
        eventName: string,
        eventParameters?: Record<string, unknown>
      ): void;
      // Alternative event tracking with Twitter's event ID
      (method: "event", eventId: string): void;
      // Queue methods
      version: string;
      queue: Array<unknown>;
      exe?: (...args: unknown[]) => void;
    };
  }
}
