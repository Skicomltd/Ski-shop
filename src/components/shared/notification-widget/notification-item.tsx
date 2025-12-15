"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { BsInfoCircleFill } from "react-icons/bs";

import { Notification, NotificationType } from "./types";

interface NotificationItemProperties {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  info: <BsInfoCircleFill className="text-primary size-5" />,
  success: <CheckCircle2 className="size-4 text-green-500" />,
  warning: <AlertCircle className="size-4 text-amber-500" />,
  error: <XCircle className="size-4 text-red-500" />,
  system: <Info className="size-4 text-gray-500" />,
};

const notificationColors: Record<NotificationType, string> = {
  info: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900",
  success: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900",
  warning: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900",
  error: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900",
  system: "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-900",
};

export function NotificationItem({ notification, onClick, onMarkAsRead }: NotificationItemProperties) {
  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  return (
    <div
      className={cn(
        "group hover:bg-primary/10 relative flex cursor-pointer gap-3 rounded-lg border p-3 transition-all hover:shadow-sm",
        notification.read ? "bg-background border-border opacity-75" : notificationColors[notification.type],
      )}
      onClick={handleClick}
    >
      {/* Unread Indicator */}
      {!notification.read && <div className="absolute top-3 right-3 size-2 rounded-full bg-blue-600" />}

      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {notification.avatar ? (
          <Avatar className="size-10">
            <AvatarImage src={notification.avatar} alt={notification.title} />
            <AvatarFallback>{notification.title[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full",
              notification.type === "info" && "bg-blue-100 dark:bg-blue-900/30",
              notification.type === "success" && "bg-green-100 dark:bg-green-900/30",
              notification.type === "warning" && "bg-amber-100 dark:bg-amber-900/30",
              notification.type === "error" && "bg-red-100 dark:bg-red-900/30",
              notification.type === "system" && "bg-gray-100 dark:bg-gray-900/30",
            )}
          >
            {notification.icon || notificationIcons[notification.type]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-foreground line-clamp-1 text-sm font-semibold">{notification.title}</h4>
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{notification.message}</p>
        <span className="text-muted-foreground mt-2 inline-block text-xs">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
