import { Notification } from "@novu/react";

export type CategorizedNotifications = Record<string, Notification[]>;

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getYesterday(date: Date): Date {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return yesterday;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Categorizes an array of notifications by "Today", "Yesterday", or formatted date headers like "May 4, 2025".
 */
export function categorizeNotifications(
  notifications: Notification[]
): CategorizedNotifications {
  const categorized: CategorizedNotifications = {};

  const now = new Date();
  const yesterday = getYesterday(now);

  notifications.forEach((notification) => {
    const createdAt =
      typeof notification.createdAt === "string"
        ? new Date(notification.createdAt)
        : new Date(notification.createdAt);

    let label: string;

    if (isSameDay(createdAt, now)) {
      label = "Today";
    } else if (isSameDay(createdAt, yesterday)) {
      label = "Yesterday";
    } else {
      label = formatDateLabel(createdAt);
    }

    if (!categorized[label]) {
      categorized[label] = [];
    }

    categorized[label].push(notification);
  });

  return categorized;
}
