"use client";

import { LocaleLink } from "@/components/shared/locale-link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LinkProps } from "next/link";
import * as React from "react";

interface NavItemProperties extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
  isMobile?: boolean;
  pathname: string;
}

interface ListItemProperties extends LinkProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export const NavItems: React.FC<NavItemProperties> = ({ links, isMobile, className, pathname }) => {
  const tNav = useTranslations("navigation");
  const tFooter = useTranslations("footer");

  const getLabelForHref = (href: string, fallback: string) => {
    switch (href) {
      case "/": {
        return tFooter("explore");
      }
      case "/about": {
        return tNav("about");
      }
      case "/shop": {
        return tNav("shop");
      }
      case "/contact": {
        // Prefer footer.contact when available, fallback to navigation.contact
        try {
          return tFooter("contact");
        } catch {
          return tNav("contact");
        }
      }
      default: {
        return fallback;
      }
    }
  };
  return (
    <NavigationMenu className={cn(isMobile && "block max-w-full", className)}>
      <NavigationMenuList className={cn(isMobile && "block")}>
        {links.map((link, index) => {
          const isActive = link.href === "/" ? pathname === link.href : pathname.includes(link.href);

          if (link.type === "dropdown" && link.subLinks) {
            const isDropdownActive = link.subLinks.some((subLink) => pathname === subLink.href);

            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger className={cn("w-full", isDropdownActive && "text-accent")}>
                  {getLabelForHref(link.href, link.title)}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[600px] md:grid-cols-2">
                    {link.subLinks.map((subLink) => (
                      <ListItem
                        key={subLink.id}
                        href={subLink.href}
                        title={getLabelForHref(subLink.href, subLink.title)}
                        className={cn(pathname === subLink.href && "bg-accent text-accent-foreground")}
                      >
                        {subLink.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                className={`hover:text-primary focus:text-primary dark:hover:text-accent dark:focus:text-accent transition-all hover:bg-transparent hover:underline focus:bg-transparent`}
                asChild
              >
                <LocaleLink
                  href={link.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "w-full bg-transparent",
                    isActive && "text-primary dark:text-accent underline",
                  )}
                >
                  {getLabelForHref(link.href, link.title)}
                </LocaleLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProperties>(
  ({ className, title, children, href, ...properties }, reference) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <LocaleLink
            ref={reference}
            href={href}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
              className,
            )}
            {...properties}
          >
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
          </LocaleLink>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
