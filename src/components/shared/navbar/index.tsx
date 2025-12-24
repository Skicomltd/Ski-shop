"use client";

import { SearchInput } from "@/components/core/miscellaneous/search-input";
import { ModernThemeSwitcher } from "@/components/core/miscellaneous/theme-variant-switcher";
import { UserAvatarProfile } from "@/components/core/miscellaneous/user-avatar-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { NAV_LINKS } from "@/lib/constants";
import { ComponentGuard } from "@/lib/routes/component-guard";
import { cn } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { ClipboardList, Menu, ShoppingCartIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React, { forwardRef, useState } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { toast } from "sonner";

import SkiButton from "../button";
import { LanguageToggle } from "../language-toggle";
import { Logo } from "../logo";
import { SearchDialog } from "./_components/search-modal";
import { NavItems } from "./nav-menu-item";

interface NavbarProperties {
  logo?: React.ReactNode;
  links?: typeof NAV_LINKS;
  className?: string;
  navbarStyle?: string;
  sticky?: boolean;
}

// NOTE: Scroll-based navbar behavior has been intentionally disabled
// to avoid interfering with Lenis smooth scrolling. The navbar now
// remains static and does not respond to scroll position.

export const Navbar = forwardRef<HTMLElement, NavbarProperties>(
  (
    {
      logo = (
        <Logo
          className={`!w-[30px] md:!w-[40px]`}
          width={40}
          height={40}
          logo="https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758641970/skicom/vd6d83v5f4nmh7jtaqlf.png"
        />
      ),
      links = NAV_LINKS,
      className,
      navbarStyle,
      sticky = true,
    },
    reference,
  ) => {
    const pathname = usePathname();
    const locale = useLocale();
    const { data: session, status } = useSession();
    const { useGetCart, useGetSavedProducts, useGetOrders } = useAppService();
    const t = useTranslations("navbar");

    const isAuthenticated = status === "authenticated";

    // Fetch cart data - only when authenticated
    const { data: cartResponse } = useGetCart({ enabled: isAuthenticated });
    const cartItemCount = cartResponse?.data?.metadata?.total || 0;
    // Fetch orders and saved products data - only when authenticated
    const { data: ordersResponse } = useGetOrders({ enabled: isAuthenticated });
    const { data: savedProductsResponse } = useGetSavedProducts({ enabled: isAuthenticated });
    const ordersCount = ordersResponse?.data?.metadata?.total || 0;
    const savedItemsCount = savedProductsResponse?.data?.metadata?.total || 0;
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isShopRoute = pathname.includes("/shop");
    const shouldStick = sticky && !isShopRoute;

    const isActiveLink = (href: string) => (href === "/" ? pathname === href : pathname.includes(href));

    const handleLogout = async () => {
      try {
        await signOut({
          redirect: true,
          callbackUrl: `/${locale}/login`,
        });
        toast.success(t("logoutSuccess"));
      } catch {
        toast.error(t("logoutFailed"));
      }
    };

    return (
      <nav
        ref={reference}
        className={cn(
          "w-full transition-all duration-500 ease-in-out",
          shouldStick && "fixed top-0 z-50",
          !shouldStick && "relative",
          navbarStyle,
        )}
      >
        <section className={cn("mx-auto max-w-[1240px]")}>
          <div
            className={cn(
              "bg-background flex items-center justify-between rounded-none px-4 transition-all duration-300",
              // Default (floating) look
              !isShopRoute && "shadow-2xl lg:mt-7 lg:rounded-full lg:px-7",
              // Shop page look (non-floating, like Jumia)
              isShopRoute && "border-border border-b shadow-none lg:mt-0 lg:rounded-none lg:px-4",
              "h-16 md:h-20",
              className,
            )}
          >
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{logo}</div>
            </div>

            {/* Desktop Navigation */}
            <NavItems links={links} pathname={pathname} className={cn("hidden transition-all duration-300 lg:flex")} />

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search - Hidden on very small screens */}
              <div className="hidden sm:block">
                <SearchDialog />
              </div>

              {/* Enhanced Cart Button with Badge */}
              <ComponentGuard requireAuth allowedRoles={["CUSTOMER"]}>
                <div className="relative">
                  <SkiButton
                    href={`/${locale}/shop/cart`}
                    variant="ghost"
                    size="icon"
                    isIconOnly
                    icon={<ShoppingCartIcon size={20} />}
                    aria-label={t("cart.ariaLabel", { count: cartItemCount })}
                    className="transition-all duration-300"
                  />
                  {cartItemCount > 0 && (
                    <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full text-xs font-medium text-white">
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </div>
              </ComponentGuard>

              {/* Mobile Menu Toggle */}
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <SkiButton variant="ghost" size="icon" className="lg:hidden" aria-label={t("menu.toggleMenu")}>
                    <Menu className="h-5 w-5" />
                  </SkiButton>
                </DrawerTrigger>
                <DrawerContent className="">
                  <div className="max-h-[85vh] space-y-6 overflow-y-auto px-6 py-6 pb-8">
                    <div className="flex items-center justify-between gap-4 px-2 py-1.5">
                      <ModernThemeSwitcher />
                      <div className={`item-center flex gap-4`}>
                        <ComponentGuard requireAuth allowedRoles={["CUSTOMER"]}>
                          <div className="relative">
                            <SkiButton
                              href={`/shop/cart`}
                              variant={`outline`}
                              onClick={() => setDrawerOpen(false)}
                              size={`icon`}
                              className={`w-full`}
                              isIconOnly
                              icon={<ShoppingCartIcon />}
                            />
                            {cartItemCount > 0 && (
                              <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full text-xs font-medium text-white">
                                {cartItemCount > 9 ? "9+" : cartItemCount}
                              </span>
                            )}
                          </div>
                        </ComponentGuard>
                        <ComponentGuard requireAuth allowedRoles={["CUSTOMER"]}>
                          <div className="relative">
                            <SkiButton
                              href={`/shop/cart/orders`}
                              variant={`outline`}
                              onClick={() => setDrawerOpen(false)}
                              size={`icon`}
                              className={`w-full`}
                              isIconOnly
                              icon={<ClipboardList />}
                            />
                            {ordersCount > 0 && (
                              <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full text-xs font-medium text-white">
                                {ordersCount > 9 ? "9+" : ordersCount}
                              </span>
                            )}
                          </div>
                        </ComponentGuard>
                        <ComponentGuard requireAuth allowedRoles={["CUSTOMER"]}>
                          <div className="relative">
                            <SkiButton
                              href={`/shop/cart/saved-items`}
                              variant={`outline`}
                              onClick={() => setDrawerOpen(false)}
                              size={`icon`}
                              className={`text-destructive w-full`}
                              isIconOnly
                              icon={<MdOutlineFavorite />}
                            />
                            {savedItemsCount > 0 && (
                              <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full text-xs font-medium text-white">
                                {savedItemsCount > 9 ? "9+" : savedItemsCount}
                              </span>
                            )}
                          </div>
                        </ComponentGuard>
                      </div>
                    </div>
                    {/* User Profile Header - Mobile-friendly design */}
                    {session?.user && (
                      <div className="dark:bg-border bg-high-grey-I flex items-center gap-3 rounded-lg p-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-accent text-foreground text-[10px]">
                            {session.user.name?.slice(0, 2)?.toUpperCase() || "SK"}
                          </AvatarFallback>
                          {session.user.image && (
                            <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <h6 className="!mb-0 truncate text-sm font-medium">{session.user.name || "User"}</h6>
                          <p className="!mb-0 truncate text-[10px] text-gray-600">{session.user.email}</p>
                        </div>
                      </div>
                    )}
                    {/* Mobile Search - Prominent placement */}
                    <div className="space-y-3">
                      <SearchInput onSearch={() => {}} className="!w-full" />
                    </div>

                    {/* Main Navigation Section - Direct mobile-friendly links */}
                    <div className="space-y-3">
                      <h3 className="!text-primary text-sm font-medium">Navigation</h3>
                      <div className="space-y-2">
                        <SkiButton
                          href={`/${locale}`}
                          variant="ghost"
                          className={cn("w-full justify-start", isActiveLink("/") && "!text-primary !underline")}
                          size="sm"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Explore
                        </SkiButton>
                        <SkiButton
                          href={`/${locale}/about`}
                          variant="ghost"
                          className={cn("w-full justify-start", isActiveLink("/about") && "!text-primary !underline")}
                          size="sm"
                          onClick={() => setDrawerOpen(false)}
                        >
                          About Us
                        </SkiButton>
                        <SkiButton
                          href={`/${locale}/shop`}
                          variant="ghost"
                          className={cn("w-full justify-start", isActiveLink("/shop") && "!text-primary !underline")}
                          size="sm"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Shop
                        </SkiButton>
                        <SkiButton
                          href={`/${locale}/contact`}
                          variant="ghost"
                          className={cn("w-full justify-start", isActiveLink("/contact") && "!text-primary !underline")}
                          size="sm"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Contact Us
                        </SkiButton>
                      </div>
                    </div>

                    {/* User Section */}
                    <div className="border-t pt-4">
                      {session?.user ? (
                        <div className="space-y-4">
                          {/* User Role-Based Navigation */}
                          <div className="space-y-3">
                            <h3 className="!text-primary text-sm font-medium">Dashboard</h3>
                            <ComponentGuard requireAuth allowedRoles={["ADMIN"]}>
                              <div className="space-y-2">
                                <SkiButton
                                  href={`/${locale}/admin/home`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  Admin Dashboard
                                </SkiButton>
                                <SkiButton
                                  href={`/${locale}/admin/users`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  Manage Users
                                </SkiButton>
                                <SkiButton
                                  href={`/${locale}/admin/products`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  Manage Products
                                </SkiButton>
                              </div>
                            </ComponentGuard>
                            <ComponentGuard requireAuth allowedRoles={["VENDOR"]}>
                              <div className="space-y-2">
                                <SkiButton
                                  href={`/dashboard/home`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  Vendor Dashboard
                                </SkiButton>
                                <SkiButton
                                  href={`/dashboard/products`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  My Products
                                </SkiButton>
                                <SkiButton
                                  href={`/dashboard/orders`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  Orders
                                </SkiButton>
                              </div>
                            </ComponentGuard>
                          </div>

                          {/* Account Actions */}
                          <div className="space-y-3">
                            <h3 className="!text-primary text-sm font-medium">Account</h3>
                            <ComponentGuard requireAuth allowedRoles={["VENDOR"]}>
                              <div className="space-y-4">
                                <SkiButton
                                  href={`/dashboard/profile`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  Profile Settings
                                </SkiButton>
                                <SkiButton
                                  href={`/dashboard/settings`}
                                  variant="ghost"
                                  className="w-full justify-start"
                                  size="sm"
                                >
                                  Account Settings
                                </SkiButton>
                              </div>
                            </ComponentGuard>

                            <SkiButton
                              onClick={handleLogout}
                              variant="ghost"
                              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                              size="sm"
                            >
                              Log Out
                            </SkiButton>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="!text-primary text-sm font-medium">Account</h3>
                          <div className="">
                            <SkiButton
                              href={`/${locale}/login`}
                              variant="outline"
                              className="mb-4 w-full"
                              onClick={() => setDrawerOpen(false)}
                            >
                              {t("auth.signIn")}
                            </SkiButton>
                            <SkiButton
                              variant="primary"
                              href={`/register`}
                              className="w-full"
                              onClick={() => setDrawerOpen(false)}
                            >
                              {t("auth.createAccount")}
                            </SkiButton>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional Features Section */}
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <h3 className="!text-primary text-sm font-medium">More</h3>
                        <div className="space-y-2">
                          <SkiButton
                            href={`/${locale}/help`}
                            variant="ghost"
                            className="w-full justify-start"
                            size="sm"
                          >
                            Help Center
                          </SkiButton>
                        </div>
                      </div>
                    </div>

                    {/* Language Toggle - Bottom placement */}
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <h3 className="!text-primary text-sm font-medium">Language</h3>
                        <LanguageToggle />
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* User Actions */}
              <div>
                {session?.user ? (
                  <div className="hidden lg:block">
                    <UserAvatarProfile showInfo />
                  </div>
                ) : (
                  <div className="hidden gap-2 lg:flex">
                    <SkiButton
                      href={`/${locale}/login`}
                      variant="outline"
                      size="xl"
                      className="transition-all duration-300"
                    >
                      {t("auth.signIn")}
                    </SkiButton>
                    <SkiButton
                      className="bg-accent transition-all duration-300"
                      variant="primary"
                      href={`/${locale}/signup`}
                      size="xl"
                    >
                      {t("auth.signUp")}
                    </SkiButton>
                  </div>
                )}
              </div>

              {/* Theme Switcher */}
              <div className="hidden lg:block">
                <ModernThemeSwitcher />
              </div>

              {/* Language Toggle */}
              <div className="hidden lg:block">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </section>
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";
