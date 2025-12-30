"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Bell, Check, Trash2 } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "../empty-state";
import { NotificationItem } from "./notification-item";
import { NotificationWidgetProperties } from "./types";

export function NotificationWidget({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  maxHeight = "500px",
}: NotificationWidgetProperties) {
  const [open, setOpen] = useState(false);

  // Always render notifications sorted from latest to earliest by timestamp
  // so the most recent activity appears at the top of the list.
  const sortedNotifications = [...notifications].sort((a, b) => {
    const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();

    return timeB - timeA;
  });

  const unreadCount = sortedNotifications.filter((n) => !n.read).length;
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
  };

  const handleClearAll = () => {
    onClearAll?.();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary relative rounded-full hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="size-6" />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {displayCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-2xl p-0 shadow-none" align="end" sideOffset={22}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {displayCount} new
              </span>
            )}
          </div>
          {sortedNotifications.length > 0 && (
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                >
                  <Check className="size-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive size-8"
                onClick={handleClearAll}
                title="Clear all"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {sortedNotifications.length === 0 ? (
          <EmptyState
            className="text-primary"
            // icon={<BellOff className="text-primary" />}
            title="No notifications."
            description="You have no notifications at the moment."
          />
        ) : (
          <ScrollArea className={cn("hide-scrollbar overflow-y-auto")} style={{ maxHeight }}>
            <div className="flex flex-col gap-2 p-2">
              {sortedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={onNotificationClick}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {sortedNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="text-primary hover:bg-primary/10 hover:text-primary w-full text-sm font-medium"
                onClick={() => {
                  setOpen(false);
                  // Navigate to notifications page
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export * from "./types";
