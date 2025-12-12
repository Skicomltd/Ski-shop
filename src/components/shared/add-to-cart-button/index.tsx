"use client";

import SkiButton from "@/components/shared/button";
import { useUnifiedCart } from "@/hooks/use-unified-cart";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

type AddToCartButtonProperties = {
  productId: string;
  quantity?: number;
  stockCount?: number;
  className?: string;
  size?: "sm" | "lg" | "icon";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  redirectOnSuccess?: boolean;
  stopEventPropagation?: boolean;
  fullWidth?: boolean;
  label?: string;
  isIconVisible?: boolean;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  stockCount,
  className,
  size = "lg",
  variant = "primary",
  redirectOnSuccess = false,
  stopEventPropagation = true,
  fullWidth = true,
  label,
  isIconVisible = true,
}: AddToCartButtonProperties) {
  const { addToCart, isPending } = useUnifiedCart();
  const router = useRouter();

  const disabled = (typeof stockCount === "number" && stockCount === 0) || isPending;

  const handleClick = (event_?: MouseEvent) => {
    if (stopEventPropagation && event_) {
      event_.preventDefault();
      event_.stopPropagation();
    }

    addToCart(productId, quantity);

    if (redirectOnSuccess) {
      // Small delay to allow toast to show before navigation
      setTimeout(() => {
        router.push("/shop/cart");
      }, 500);
    }
  };

  const buttonLabel = isPending
    ? "Adding..."
    : typeof stockCount === "number" && stockCount === 0
      ? "Out of Stock"
      : (label ?? "Add to Cart");

  return (
    <SkiButton
      variant={variant}
      size={size}
      className={cn(fullWidth ? "w-full" : "", "flex items-center gap-2", className)}
      isDisabled={disabled}
      onClick={handleClick}
      isLeftIconVisible={isIconVisible}
      icon={<ShoppingCart size={20} />}
    >
      {buttonLabel}
    </SkiButton>
  );
}
