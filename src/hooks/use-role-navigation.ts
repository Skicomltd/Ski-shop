"use client";

import {
  createDivider,
  createNavItem,
  createNavItemWithChildren,
  dangerBadge,
  type NavItem,
} from "@/components/shared/sidebar";
import { usePayoutService } from "@/services/dashboard/vendor/payouts";
import { useNotificationService } from "@/services/externals/notifications/use-notification-service";
import { ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { FaGamepad } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { IoRibbonOutline } from "react-icons/io5";
import { MdDashboard, MdOutlineAddCard, MdOutlineVerifiedUser } from "react-icons/md";
import { PiUsersThreeLight } from "react-icons/pi";
import { RiAdvertisementLine, RiShoppingCartLine, RiUserLine } from "react-icons/ri";
import { TbCreditCard, TbSettings2, TbShoppingBag, TbUserCog, TbUsers } from "react-icons/tb";

export const useRoleNavigation = (): NavItem[] => {
  const { data: session } = useSession();
  const { useGetUnreadVendorOrderNotifications } = useNotificationService();

  const userRole = session?.user?.role.name.toUpperCase();

  const { useGetWithdrawalsHistory } = usePayoutService();

  // Fetch data with minimal queries for badge counts
  const { data: unreadVendorOrdersCount = 0 } = useGetUnreadVendorOrderNotifications({ staleTime: 30_000 });
  const { data: withdrawalsData } = useGetWithdrawalsHistory(undefined, { staleTime: 30_000 });

  // Calculate badge counts based on unread vendor order notifications
  const orderCount = unreadVendorOrdersCount || 0;
  const pendingWithdrawals = withdrawalsData?.success
    ? withdrawalsData.data?.filter((w: WithdrawalHistoryItem) => w.status === "pending")?.length || 0
    : 0;

  const effectiveOrderCount = orderCount;

  const createSettingsMenu = (role: string): NavItem => {
    const baseRoute =
      role === "SUPER_ADMIN" ? "/super-admin/settings" : role === "ADMIN" ? "/admin/settings" : "/dashboard/settings";

    const allCommonSettings = [
      createNavItem("rate-this-app", "Rate This App", "", {
        icon: ThumbsUp,
        actionType: "open-rate-app-modal",
      }),
    ];

    const adminSpecificSettings = [
      createNavItem("general", "General", "/admin/settings/general", {
        icon: TbUsers,
      }),
      createNavItem("revenue", "Revenue", "/admin/settings/revenue", {
        icon: GiWallet,
      }),
      createNavItem("promotion", "Promotion", "/admin/settings/promotion", {
        icon: RiAdvertisementLine,
      }),
      createNavItem("play-to-win", "Play to win", "/admin/settings/play-to-win", {
        icon: FaGamepad,
      }),
    ];

    const superAdminSpecificSettings = [
      createNavItem("admin-management", "Admin Management", "/super-admin/settings/admins", {
        icon: TbUserCog,
      }),
      createNavItem("platform-settings", "Platform Configuration", "/super-admin/settings/platform", {
        icon: MdOutlineVerifiedUser,
      }),
    ];

    const finalSettings: NavItem[] = [];

    if (role === "ADMIN") {
      // For admins, show General and other admin-specific settings first, then common items
      finalSettings.push(...adminSpecificSettings, ...allCommonSettings);
    } else if (role === "SUPER_ADMIN") {
      // For super admins, show General/admin settings first, then super-admin-only, then common items
      finalSettings.push(...adminSpecificSettings, ...superAdminSpecificSettings, ...allCommonSettings);
    } else {
      // For other roles (e.g., vendors), only show common settings
      finalSettings.push(...allCommonSettings);
    }

    return createNavItemWithChildren("settings", "Settings", baseRoute, finalSettings, {
      icon: TbSettings2,
    });
  };

  switch (userRole) {
    case "SUPER_ADMIN": {
      return [
        createNavItem("dashboard", "Dashboard", "/super-admin/home", { icon: MdDashboard }),
        createDivider("admin-section"),
        createNavItemWithChildren(
          "user-management",
          "User Management",
          "/super-admin/users",
          [
            createNavItem("admins", "Admins", "/super-admin/users/admins", { icon: TbUserCog }),
            createNavItem("vendors", "Vendors", "/super-admin/users/vendors", { icon: RiUserLine }),
            createNavItem("customers", "Customers", "/super-admin/users/customers", { icon: TbUsers }),
          ],
          { icon: PiUsersThreeLight },
        ),
        createNavItem("orders", "All Orders", "/super-admin/orders", {
          icon: RiShoppingCartLine,
          badge: effectiveOrderCount > 0 ? dangerBadge(effectiveOrderCount) : undefined,
        }),
        createNavItem("products", "Platform Products", "/super-admin/products", { icon: TbShoppingBag }),
        createNavItem("payouts", "Platform Payouts", "/super-admin/payouts", { icon: MdOutlineAddCard }),
        createNavItem("revenues", "Platform Revenue", "/super-admin/revenues", { icon: GiWallet }),
        createDivider("platform-section"),
        createNavItem("subscriptions", "Subscriptions", "/super-admin/subscriptions", { icon: IoRibbonOutline }),
        createNavItem("promotions", "Promotions & Ads", "/super-admin/promotions", { icon: RiAdvertisementLine }),
        createNavItem("play-to-win", "Play 2 Win", "/super-admin/play-to-win", { icon: FaGamepad }),
        createDivider("settings-section"),
        createSettingsMenu("SUPER_ADMIN"),
      ];
    }

    case "ADMIN": {
      return [
        createNavItem("admin", "Dashboard", "/admin/home", { icon: MdDashboard }),
        createDivider("management-section"),
        createNavItem("users", "Users", "/admin/users", { icon: PiUsersThreeLight }),
        createNavItem("orders", "Orders", "/admin/orders", {
          icon: RiShoppingCartLine,
          badge: effectiveOrderCount > 0 ? dangerBadge(effectiveOrderCount) : undefined,
        }),
        createNavItem("payouts", "Payouts", "/admin/payouts", { icon: MdOutlineAddCard }),
        createNavItem("products", "Skicom Products", "/admin/products", { icon: TbShoppingBag }),
        createNavItem("revenues", "Revenues", "/admin/revenues", { icon: GiWallet }),
        createDivider("platform-section"),
        createNavItem("subscriptions", "Subscriptions", "/admin/subscriptions", { icon: IoRibbonOutline }),
        createNavItem("promotions", "Promotions & Ads", "/admin/promotions", { icon: RiAdvertisementLine }),
        createNavItem("play-to-win", "Play 2 Win", "/admin/play-to-win", { icon: FaGamepad }),
        createDivider("settings-section"),
        // createNavItem("settings", "Settings", "/admin/settings", { icon: TbSettings2 }),
        createSettingsMenu("ADMIN"),
      ];
    }
    default: {
      return [
        createNavItem("home", "Dashboard", "/dashboard/home", { icon: MdDashboard }),
        // createDivider("business-section"),
        createNavItem("products", "My Products", "/dashboard/products", { icon: TbShoppingBag }),
        createNavItem("orders", "Orders", "/dashboard/orders", {
          icon: RiShoppingCartLine,
          badge: effectiveOrderCount > 0 ? dangerBadge(effectiveOrderCount) : undefined,
        }),
        // createDivider("finance-section"),
        createNavItem("payouts", "Payouts", "/dashboard/payouts", {
          icon: TbCreditCard,
          badge: pendingWithdrawals > 0 ? dangerBadge(pendingWithdrawals) : undefined,
        }),
        createNavItem("promotions", "Promotions", "/dashboard/promotions", {
          icon: RiAdvertisementLine,
        }),
        // createDivider("account-section"),
        createNavItem("profile", "Profile", "/dashboard/profile", { icon: RiUserLine }),
        createSettingsMenu("VENDOR"),
      ];
    }
  }
};
