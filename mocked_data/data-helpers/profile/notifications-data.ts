export interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
  date: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

export const NotificationsData: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Your application for Mission:Unite hackathon has been accepted!",
    date: new Date(),
    read: false,
    actionUrl: "/hackathon/1",
    actionText: "View hackathon",
  },
  {
    id: "2",
    type: "info",
    title: "New hackathon announced: Web3 Innovation Challenge",
    description: "Registration opens next week",
    date: new Date(Date.now() - 86400000), // yesterday
    read: true,
    actionUrl: "/hackathon/2",
    actionText: "Learn more",
  },
  {
    id: "3",
    type: "warning",
    title: "Application deadline approaching",
    description: "Only 2 days left to apply for AI & ML Hackathon",
    date: new Date(Date.now() - 172800000), // 2 days ago
    read: false,
    actionUrl: "/hackathon/3",
    actionText: "Apply now",
  },
];
