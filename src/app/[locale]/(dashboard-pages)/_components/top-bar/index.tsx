"use client";

// import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { ModernThemeSwitcher } from "@/components/core/miscellaneous/theme-variant-switcher";
import { UserAvatarProfile } from "@/components/core/miscellaneous/user-avatar-profile";
// import { LanguageToggle } from "@/components/shared/language-toggle";
import { NotificationWidget, type Notification } from "@/components/shared/notification-widget";
import { AppEventsListener } from "@/components/shared/notification-widget/app-events-listener";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSSE } from "@/context/sse-provider";
import { useDashboardProfileService } from "@/services/dashboard/vendor/users/use-profile-service";
import { useNotificationService } from "@/services/externals/notifications/use-notification-service";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type TopBarProperties = {
  notificationsCount?: number;
  className?: string;
};

export default function TopBar({ className = "" }: TopBarProperties) {
  const router = useRouter();
  const { on } = useSSE();
  const { data: session } = useSession();

  const roleName = session?.user?.role?.name?.toLowerCase();
  const isVendor = roleName === "vendor";
  const userId = session?.user?.id as string | undefined;

  const { useGetVendorProfileInfo } = useDashboardProfileService();
  const { data: vendorProfileInfoResponse } = useGetVendorProfileInfo(isVendor ? userId : undefined);
  const isStarSeller = Boolean(vendorProfileInfoResponse?.data?.store?.isStarSeller);

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
      <header className={`bg-background sticky top-0 flex items-center justify-between ${className}`}>
        <div className="relative hidden min-w-0 flex-1 md:block">
          <SidebarTrigger className="text-primary size-9" />
          {/* <SearchInput
            isDisabled
            className={`bg-muted h-full w-full max-w-xl min-w-0 rounded-md border-none`}
            onSearch={() => {}}
          /> */}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {isVendor && isStarSeller && (
            <Badge className="border-border bg-background text-primary flex items-center gap-1 border font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" />
              Star Seller
            </Badge>
          )}
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
          {/* <LanguageToggle /> */}
        </div>
      </header>
      <AppEventsListener />
    </>
  );
}
