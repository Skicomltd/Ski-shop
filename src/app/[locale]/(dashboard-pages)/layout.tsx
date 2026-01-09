"use client";

import Loading from "@/app/Loading";
import { DashboardSidebar } from "@/components/shared/sidebar/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRoleNavigation } from "@/hooks/use-role-navigation";
import { useEffect, useState } from "react";

import { MobileDownloadBanner } from "../_components/mobile-download-banner";
import TopBar from "./_components/top-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navItems = useRoleNavigation();
  const [isMobile, setIsMobile] = useState<boolean | undefined>();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set initial mobile state
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    setIsHydrated(true);

    // Listen for resize events
    window.addEventListener("resize", checkViewport);

    // Cleanup
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading showLogo />
      </div>
    );
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-10 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="h-10 w-10 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Dashboard Not Available</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              The dashboard is optimized for desktop and laptop screens. Please access it from a larger device for the
              best experience. Or download the mobile application
            </p>
            <div className="space-y-3">
              {/* <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>Mobile devices are not supported</span>
              </div> */}
              <div className="flex items-center justify-center space-x-2 text-sm font-medium dark:text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Desktop & laptop recommended</span>
              </div>
            </div>
          </div>
        </div>
        <MobileDownloadBanner
          wrapperClassName="p-0 my-0 mb-4 text-center"
          titleClassName="!text-white"
          descriptionClassName="!text-muted"
        />
      </div>
    );
  }

  // Desktop view
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full min-w-0 overflow-hidden">
        <DashboardSidebar
          navItems={navItems}
          autoExpandOnActiveChild={true}
          persistExpandedState={true}
          logoProperties={{
            width: 50,
            height: 50,
            className: "transition-all duration-200 !w-40",
          }}
          className="transition-all duration-300 ease-in-out"
          backgroundClassName="bg-primary"
          navItemClassNames={{
            parent: {
              base: "px-4 py-3 !text-white",
              active: " font-semibold !text-primary rounded-md !bg-white",
              hover: "hover:bg-white/10",
            },
            child: {
              base: "!text-white",
              active: "bg-primary/80 !text-white",
              hover: "hover:bg-white/10",
            },
            submenu: "border-primary/60",
          }}
        />
        <SidebarInset className="min-w-0 flex-1">
          {/* Make this the scroll container so the sticky header works correctly */}
          <div className="flex h-full min-h-0 flex-col overflow-auto">
            <header className="bg-background !sticky top-0 z-50 flex h-20 w-full shrink-0 items-center gap-2 overflow-hidden border-b px-4 py-5">
              <SidebarTrigger className="text-primary -ml-1 size-9" />
              <div className="min-w-0 flex-1">
                <TopBar notificationsCount={0} className="w-full min-w-0 px-6" />
              </div>
            </header>
            <main className="flex-1 bg-[#F8F8F9] p-6 dark:bg-[#111111]">
              <section className="mx-auto max-w-[1240px]">{children}</section>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
