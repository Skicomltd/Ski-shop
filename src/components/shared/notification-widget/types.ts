export type NotificationType = "info" | "success" | "warning" | "error" | "system";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  icon?: React.ReactNode;
}

export interface NotificationWidgetProperties {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  maxHeight?: string;
}
