import { Button } from "@/components/ui/button";
import { localizeHref } from "@/lib/i18n/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { cloneElement, forwardRef, ReactElement } from "react";
import { LuLoader, LuPlus } from "react-icons/lu";

// Types are now globally available in src/types/

/**
 * CustomButton component to render a button with various styles and states.
 *
 * @param {ButtonProps} props - Properties to configure the button.
 * @returns {JSX.Element} The rendered button component.
 */
const SkiButton = forwardRef<HTMLButtonElement, ButtonProperties>(
  (
    {
      type = "button",
      variant,
      size = "xl",
      children,
      isLoading = false,
      isLeftIconVisible = false,
      isRightIconVisible = false,
      icon,
      isDisabled = false,
      isIconOnly = false,
      ariaLabel,
      href,
      className,
      onClick,
    },
    reference,
  ) => {
    const locale = useLocale();
    const modifiedIcon = icon ? (
      cloneElement(
        icon as ReactElement,
        {
          className: "w-[1rem] h-[1rem] shrink-0",
          "data-testid": "icon",
        } as React.HTMLAttributes<HTMLElement>,
      )
    ) : (
      <LuPlus className="h-[1rem] w-[1rem] shrink-0" data-testid="icon" />
    );

    const buttonContent = (
      <>
        {isLeftIconVisible && !isLoading && modifiedIcon}
        {isLoading && <LuLoader className="h-[1rem] w-[1rem] animate-spin" data-testid="loading-spinner" />}
        {isIconOnly && !isLoading && modifiedIcon}
        {!isIconOnly && children}
        {!isIconOnly && !children && isLoading && "Loading"}
        {isRightIconVisible && !isLoading && modifiedIcon}
      </>
    );

    const buttonClasses = `transition-all duration-300 ease-in-out rounded-full cursor-pointer shadow-none ${
      isDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-sneob dark:hover:shadow-sneobw focus:shadow-none"
    } ${className}`;

    if (href) {
      const isExternal = /^https?:\/\//.test(href);

      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
            <Button
              type={type}
              variant={variant}
              size={size}
              disabled={isDisabled}
              aria-label={ariaLabel}
              className={buttonClasses}
              onClick={onClick}
              role="button"
              ref={reference}
            >
              {buttonContent}
            </Button>
          </a>
        );
      }

      const localized = localizeHref(href, locale);
      return (
        <Link href={isDisabled ? "" : localized} passHref aria-label={ariaLabel}>
          <Button
            type={type}
            variant={variant}
            size={size}
            disabled={isDisabled}
            aria-label={ariaLabel}
            className={buttonClasses}
            onClick={onClick}
            role="button"
            ref={reference}
          >
            {buttonContent}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        type={type}
        variant={variant}
        size={size}
        disabled={isDisabled}
        aria-label={ariaLabel}
        className={buttonClasses}
        onClick={onClick}
        role="button"
        ref={reference}
      >
        {buttonContent}
      </Button>
    );
  },
);
SkiButton.displayName = "SkiButton"; // This is useful for debugging in React DevTools

export default SkiButton;
