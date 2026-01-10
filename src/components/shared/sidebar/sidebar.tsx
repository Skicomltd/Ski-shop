"use client";

import { DialogClose } from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import SkiButton from "../button";
import { Modal } from "../dialog/content-modal";
import { LocaleLink } from "../locale-link";
import { Logo } from "../logo";
import { Ratings } from "../ratings";

// Helper: robust path matching using full link, not id substring
const pathMatches = (currentPath: string, targetPath: string) => {
  if (!targetPath) return false;
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
};

// Enhanced types for sidebar navigation
interface BadgeConfig {
  variant: "danger" | "success" | "warning" | "info";
  count: number;
}

interface BaseNavItem {
  id: string;
  route: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: BadgeConfig;
  divider?: boolean;
  link: string;
  actionType?: string;
}

interface NavItemWithChildren extends BaseNavItem {
  children: NavItem[];
  collapsible: true;
}

interface NavItemWithoutChildren extends BaseNavItem {
  children?: never;
  collapsible?: false;
}

export type NavItem = NavItemWithChildren | NavItemWithoutChildren;

interface DashboardSidebarProperties {
  navItems: NavItem[];
  className?: string;
  logoProperties?: {
    width?: number;
    height?: number;
    className?: string;
  };
  defaultExpandedItems?: string[];
  autoExpandOnActiveChild?: boolean;
  persistExpandedState?: boolean;
  /**
   * Optional class applied to the sidebar background container.
   */
  backgroundClassName?: string;
  /**
   * Override classes for nav items to make the sidebar reusable with different themes.
   */
  navItemClassNames?: {
    parent?: {
      base?: string;
      active?: string;
      hover?: string;
    };
    child?: {
      base?: string;
      active?: string;
      hover?: string;
    };
    submenu?: string; // container for SidebarMenuSub
    badge?: {
      base?: string;
      variants?: Partial<Record<BadgeConfig["variant"], string>>;
    };
  };
}

export function DashboardSidebar({
  navItems,
  className,
  logoProperties = { width: 80, height: 47 },
  defaultExpandedItems = [],
  autoExpandOnActiveChild = true,
  persistExpandedState = false,
  backgroundClassName,
  navItemClassNames,
}: DashboardSidebarProperties) {
  const pathname = usePathname();
  const userID = pathname.split("/")[2];
  const currentLocale = pathname.split("/")[1] || "";
  const { setOpenMobile, state } = useSidebar();
  // Initialize expanded items state
  const getInitialExpandedItems = (): Set<string> => {
    const initialItems = new Set<string>();

    // Add default expanded items
    for (const item of defaultExpandedItems) {
      initialItems.add(item);
    }

    // Auto-expand items with active children
    if (autoExpandOnActiveChild) {
      for (const item of navItems) {
        if (item.children) {
          const hasActiveChild = item.children.some((child) => pathname.includes(child.id));
          if (hasActiveChild) {
            initialItems.add(item.id);
          }
        }
      }
    }

    // Load from localStorage if persistence is enabled
    if (persistExpandedState && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("sidebar-expanded-items");
        if (stored) {
          const storedItems = JSON.parse(stored);
          for (const item of storedItems) {
            initialItems.add(item);
          }
        }
      } catch {
        // Silently fail if localStorage is not available
      }
    }

    return initialItems;
  };

  // State for managing expanded menu items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(getInitialExpandedItems);
  const [appRating, setAppRating] = useState(0);
  const [appReview, setAppReview] = useState("");

  const renderIcon = (item: NavItem) => {
    if (item.icon) {
      const Icon = item.icon;
      return <Icon className="h-5 w-5" />;
    }
    return null;
  };

  const handleCloseOnMobile = () => {
    setOpenMobile(false);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((previous) => {
      const newSet = new Set(previous);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }

      // Persist to localStorage if enabled
      if (persistExpandedState && typeof window !== "undefined") {
        try {
          localStorage.setItem("sidebar-expanded-items", JSON.stringify([...newSet]));
        } catch {
          // Silently fail if localStorage is not available
        }
      }

      return newSet;
    });
  };

  const toLocalizedLink = useCallback(
    (rawLink: string) => {
      const base = rawLink.startsWith("/") ? rawLink : `/${rawLink}`;
      return currentLocale ? `/${currentLocale}${base}` : base;
    },
    [currentLocale],
  );

  const isItemActive = (item: NavItem): boolean => {
    const itemLink = toLocalizedLink(item.link.replace(":userID", userID || ""));
    const directMatch = pathMatches(pathname, itemLink);
    if (directMatch) return true;
    if (item.children) {
      return item.children.some((child) => {
        const childLink = toLocalizedLink(child.link.replace(":userID", userID || ""));
        return pathMatches(pathname, childLink);
      });
    }
    return false;
  };

  const isChildActive = (childLink: string): boolean => {
    return pathMatches(pathname, childLink);
  };

  // Auto-expand parent when child becomes active
  useEffect(() => {
    if (autoExpandOnActiveChild) {
      for (const item of navItems) {
        if (item.children) {
          const hasActiveChild = item.children.some((child) => {
            const childLink = toLocalizedLink(child.link.replace(":userID", userID || ""));
            return pathMatches(pathname, childLink);
          });
          if (hasActiveChild && !expandedItems.has(item.id)) {
            setExpandedItems((previous) => {
              const newSet = new Set(previous);
              newSet.add(item.id);

              // Persist to localStorage if enabled
              if (persistExpandedState && typeof window !== "undefined") {
                try {
                  localStorage.setItem("sidebar-expanded-items", JSON.stringify([...newSet]));
                } catch {
                  // Silently fail if localStorage is not available
                }
              }
              return newSet;
            });
          }
        }
      }
    }
  }, [pathname, navItems, autoExpandOnActiveChild, expandedItems, persistExpandedState, userID, toLocalizedLink]);

  const renderMenuItem = (item: NavItem) => {
    if (item.divider) {
      return <div key={item.id} className="border-border my-4 border-t" />;
    }

    const link = item.link.replace(":userID", userID || "");
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    // Compute reusable class sets with defaults + overrides
    const parentBase = cn(
      "mx-auto flex h-[48px] w-full items-center gap-3 rounded-lg text-base font-medium transition-all duration-200 text-mid-grey-II",
      navItemClassNames?.parent?.base,
    );
    const parentActive = cn(
      "bg-primary/10 text-primary shadow-active border-primary rounded-none border-l-4",
      navItemClassNames?.parent?.active,
    );
    const parentHover = cn("hover:bg-primary/10", navItemClassNames?.parent?.hover);

    const childBase = cn(
      "flex h-[40px] items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 text-mid-grey-II",
      navItemClassNames?.child?.base,
    );
    const childBaseWithCursor = cn("cursor-pointer", childBase);
    const childActive = cn(
      "bg-primary/10 text-primary shadow-active border-primary rounded-none border-l-2",
      navItemClassNames?.child?.active,
    );
    const childHover = cn("hover:bg-primary/10", navItemClassNames?.child?.hover);

    const submenuContainer = cn("border-border ml-4 border-l pl-4", navItemClassNames?.submenu);

    const badgeBaseParent = cn(
      "mr-4 flex h-5 w-5 items-center justify-center rounded-full text-xs",
      navItemClassNames?.badge?.base,
    );
    const badgeBaseChild = cn(
      "mr-4 ml-auto flex h-4 w-4 items-center justify-center rounded-full text-xs",
      navItemClassNames?.badge?.base,
    );

    const badgeVariantClass = (variant: BadgeConfig["variant"]) => {
      const override = navItemClassNames?.badge?.variants?.[variant];
      if (override) return override;
      switch (variant) {
        case "danger": {
          return "bg-mid-danger text-white !font-medium !text-xs";
        }
        case "success": {
          return "text-mid-grey-II bg-green-500";
        }
        case "warning": {
          return "bg-accent text-mid-grey-II";
        }
        case "info": {
          return "bg-primary text-mid-grey-II";
        }
        default: {
          return "text-mid-grey-II bg-gray-200";
        }
      }
    };

    return (
      <SidebarMenuItem key={item.id}>
        {hasChildren ? (
          // Parent item with children
          <>
            <SidebarMenuButton
              onClick={() => toggleExpanded(item.id)}
              className={cn(parentBase, isActive ? parentActive : parentHover)}
            >
              {renderIcon(item)}
              <span className="flex-1 font-medium">{item.route}</span>
              {item.badge && (
                <SidebarMenuBadge
                  className={cn(
                    badgeBaseParent,
                    badgeVariantClass(item.badge.variant),
                    item.badge.count === 0 && "hidden",
                  )}
                >
                  {item.badge.count}
                </SidebarMenuBadge>
              )}
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
              )}
            </SidebarMenuButton>
            {/* Submenu */}
            {isExpanded && (
              <SidebarMenuSub className={submenuContainer}>
                {item.children.map((child) => {
                  const childLink = toLocalizedLink(child.link.replace(":userID", userID || ""));
                  const isChildActiveState = isChildActive(childLink);

                  return (
                    <SidebarMenuSubItem key={child.id}>
                      {child.actionType === "open-rate-app-modal" ? (
                        <Modal
                          title=""
                          description=""
                          triggerStructure={
                            <SidebarMenuSubButton
                              className={cn(childBaseWithCursor, isChildActiveState ? childActive : childHover)}
                            >
                              {renderIcon(child)}
                              <span className="font-medium">{child.route}</span>
                              {child.badge && (
                                <SidebarMenuBadge
                                  className={cn(
                                    badgeBaseChild,
                                    badgeVariantClass(child.badge.variant),
                                    child.badge.count === 0 && "hidden",
                                  )}
                                >
                                  {child.badge.count}
                                </SidebarMenuBadge>
                              )}
                            </SidebarMenuSubButton>
                          }
                          width="max-w-md"
                        >
                          <div className="bg-background mx-auto w-full max-w-md rounded-2xl">
                            <div className="text-center">
                              <h3 className="!text-2xl !font-bold">Rate Our App</h3>
                              <p className="text-muted-foreground mt-1 text-sm">How would you rate our app?</p>
                              <p className="text-muted-foreground mt-4 text-xs">Tap the stars to choose</p>
                            </div>
                            <div className="mt-3 flex justify-center">
                              <Ratings readonly={false} rating={appRating} size="!size-10" onChange={setAppRating} />
                            </div>
                            <div className="mt-4">
                              <textarea
                                value={appReview}
                                onChange={(event_) => setAppReview(event_.target.value)}
                                className="focus:ring-primary h-28 w-full rounded-lg border p-3 text-sm outline-none focus:ring-2"
                                placeholder="Write a review (Optional)"
                              />
                            </div>
                            <DialogClose asChild>
                              <SkiButton variant="primary" className="mt-5 w-full" isDisabled={appRating === 0}>
                                Save Rating
                              </SkiButton>
                            </DialogClose>
                          </div>
                        </Modal>
                      ) : (
                        <SidebarMenuSubButton
                          asChild
                          className={cn(childBase, isChildActiveState ? childActive : childHover)}
                        >
                          <LocaleLink onClick={handleCloseOnMobile} href={childLink} data-testid={child.id}>
                            {renderIcon(child)}
                            <span className="font-medium">{child.route}</span>
                            {child.badge && (
                              <SidebarMenuBadge
                                className={cn(
                                  badgeBaseChild,
                                  badgeVariantClass(child.badge.variant),
                                  child.badge.count === 0 && "hidden",
                                )}
                              >
                                {child.badge.count}
                              </SidebarMenuBadge>
                            )}
                          </LocaleLink>
                        </SidebarMenuSubButton>
                      )}
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            )}
          </>
        ) : (
          // Regular menu item without children
          <SidebarMenuButton asChild className={cn(parentBase, isActive ? parentActive : parentHover)}>
            <LocaleLink onClick={handleCloseOnMobile} href={link} data-testid={item.id}>
              {renderIcon(item)}
              <span className="font-medium">{item.route}</span>
              {item.badge && (
                <SidebarMenuBadge
                  className={cn(
                    badgeBaseParent,
                    badgeVariantClass(item.badge.variant),
                    item.badge.count === 0 && "hidden",
                  )}
                >
                  {item.badge.count}
                </SidebarMenuBadge>
              )}
            </LocaleLink>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn("border-border border-r-[0.5px] shadow-none", backgroundClassName, className)}
    >
      <SidebarHeader
        className={cn("m-2 h-[60px] items-center justify-center rounded-md !bg-white/50", backgroundClassName)}
      >
        <Logo width={logoProperties.width} height={logoProperties.height} className={logoProperties.className} />
      </SidebarHeader>
      <SidebarContent className={cn("hide-scrollbar", backgroundClassName)} data-lenis-prevent>
        <SidebarMenu className={cn(`space-y-2 p-4`, state === "collapsed" && "p-0")}>
          {navItems.map((item) => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
