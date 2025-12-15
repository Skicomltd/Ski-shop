"use client";

import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { ModernThemeSwitcher } from "@/components/core/miscellaneous/theme-variant-switcher";
import { UserAvatarProfile } from "@/components/core/miscellaneous/user-avatar-profile";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { NotificationWidget, type Notification } from "@/components/shared/notification-widget";
import { AppEventsListener } from "@/components/shared/notification-widget/app-events-listener";
import { useSSE } from "@/context/sse-provider";
import { useNotificationService } from "@/services/externals/notifications/use-notification-service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type TopBarProperties = {
  notificationsCount?: number;
  className?: string;
};

export default function TopBar({ className = "" }: TopBarProperties) {
  const router = useRouter();
  const { on } = useSSE();

  const { useGetNotifications, useMarkNotificationAsRead, useMarkAllAsRead, useClearAllNotifications } =
    useNotificationService();

  const { data: notifications = [], refetch } = useGetNotifications(
    { isRead: false },
    {
      refetchOnWindowFocus: true,
    },
  );

  const markNotificationAsRead = useMarkNotificationAsRead({
    onSuccess: () => {
      refetch();
    },
  });

  const markAllAsRead = useMarkAllAsRead({
    onSuccess: () => {
      refetch();
    },
  });

  const clearAllNotifications = useClearAllNotifications({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    const off = on("*", () => {
      // Whenever an SSE notification arrives, refresh the list so the
      // widget reflects the latest state.
      refetch();
    });

    return () => {
      off();
    };
  }, [on, refetch]);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead.mutate({ id: notificationId });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate(undefined as unknown as void);
  };

  const handleClearAll = () => {
    clearAllNotifications.mutate(undefined as unknown as void);
  };

  return (
    <>
      <header className={`bg-background flex h-16 items-center justify-between ${className}`}>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <SearchInput
            disabled
            className={`bg-muted w-full max-w-xl min-w-0 rounded-md border-none`}
            onSearch={() => {}}
          />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <NotificationWidget
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
          />
          <div className="relative border-l border-black/20 pl-4">
            <UserAvatarProfile showInfo />
          </div>
          <ModernThemeSwitcher />
          <LanguageToggle />
        </div>
      </header>
      <AppEventsListener />
    </>
  );
}
