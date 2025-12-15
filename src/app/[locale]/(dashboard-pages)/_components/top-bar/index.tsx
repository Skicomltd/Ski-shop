"use client";

import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { ModernThemeSwitcher } from "@/components/core/miscellaneous/theme-variant-switcher";
import { UserAvatarProfile } from "@/components/core/miscellaneous/user-avatar-profile";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { AppEventsListener } from "@/components/shared/notification-widget/app-events-listener";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BellDot } from "lucide-react";
// import { useSession } from "next-auth/react";
import Image from "next/image";

// import { useEffect } from "react";

type TopBarProperties = {
  notificationsCount?: number;
  className?: string;
};

// onSearch,
export default function TopBar({ notificationsCount = 0, className = "" }: TopBarProperties) {
  // const { data: session } = useSession();
  // useEffect(() => {}, [session]);
  // Dropdown handled by shadcn DropdownMenu

  const notifications = [
    {
      id: "1",
      title: "New Order Received",
      message: 'You\'ve received a new order (#32415) for "Oraimo Freepods 4." ',
      time: "Sep 5, 2024 • 9:09 AM",
      actionText: "Tap to view and fulfill.",
    },
    {
      id: "2",
      title: "Package Picked Up!",
      message: "A rider has picked up your package. It's on the way! Click",
      time: "Sep 5, 2024 • 9:09 AM",
      actionText: "here",
    },
    {
      id: "3",
      title: "New Product Added !",
      message: 'our product "Samsung Galaxy A15" has been added to your store successfully.',
      time: "Sep 5, 2024 • 9:09 AM",
    },
  ];

  // dropdown behavior delegated to DropdownMenu component

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
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="focus:ring-primary-500 relative rounded-full p-1 text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  <span className="sr-only">View notifications</span>
                  <BellDot size="24" className="" />
                  {notificationsCount > 0 && (
                    <span className="bg-destructive absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white">
                      {notificationsCount > 9 ? "9+" : notificationsCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[min(92vw,380px)] p-3">
                <div className="max-h-96 space-y-3 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 rounded-md p-3 hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                          <Image src="/images/info.svg" alt="info" width={24} height={24} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="!font-bold">{n.title}</p>
                        </div>
                        <p className="!text-sm break-words">
                          {n.message}
                          {n.actionText ? " " : ""}
                          {n.actionText && (
                            <a href="#" className="hover:underline">
                              {n.actionText}
                            </a>
                          )}
                        </p>
                        <p className="!text-primary mt-2 !text-xs">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
