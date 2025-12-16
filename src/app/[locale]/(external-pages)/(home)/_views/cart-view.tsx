/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/no-array-reduce */
"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export const CartView = () => {
  const { data: session } = useSession();
  const { useGetCart, useRemoveFromCart, useUpdateCartItem } = useAppService();
  const locale = useLocale() as Locale;
  // Mutations
  const { mutateAsync: updateQuantity, isPending: isUpdating } = useUpdateCartItem();
  const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveFromCart();

  // Fetch cart data
  const { data: cartResponse, isLoading, error, refetch } = useGetCart();
  const cartItems = cartResponse?.data?.items || [];
  const cartMetadata = cartResponse?.data?.metadata;

  // Local quantity state that updates immediately on button clicks
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

  // Sync local quantities from server cart on load/refetch
  useEffect(() => {
    const initial: Record<string, number> = {};
    for (const ci of cartItems as CartItem[]) {
      initial[ci.id] = ci.quantity;
    }
    setLocalQuantities(initial);
  }, [cartItems]);

  // Debounce the local quantities, so rapid clicks coalesce
  const [debouncedQuantities] = useDebounce(localQuantities, 500);

  // Apply debounced quantities to server (update/remove)
  useEffect(() => {
    if (!cartItems?.length) return;

    for (const ci of cartItems as CartItem[]) {
      const target = debouncedQuantities?.[ci.id];

      // Skip if unchanged or not available yet
      if (typeof target !== "number" || target === ci.quantity) continue;

      if (target < 1) {
        removeItem(ci.id, {
          onSuccess: () => {
            toast.success("Item removed from cart");
            refetch();
          },
          onError: (error) => {
            toast.error("Failed to remove item", {
              description: error.message,
            });
          },
        });
        continue;
      }

      updateQuantity(
        { itemId: ci.id, quantity: target },
        {
          onSuccess: () => {
            toast.success("Quantity updated");
            refetch();
          },
        },
      );
    }
  }, [debouncedQuantities, cartItems, removeItem, updateQuantity, refetch]);

  // Button handler: update local state immediately, UI reflects instantly
  const handleLocalQuantityChange = (itemId: string, action: "increase" | "decrease") => {
    setLocalQuantities((previous) => {
      const current =
        typeof previous[itemId] === "number"
          ? previous[itemId]
          : (cartItems.find((it: CartItem) => it.id === itemId)?.quantity ?? 0);

      return {
        ...previous,
        [itemId]: action === "increase" ? current + 1 : current - 1,
      };
    });
  };

  if (!session) {
    return (
      <EmptyState
        className={`mx-auto mt-30 max-w-[1240px]`}
        title="Can't view cart"
        description={"Please login to view your cart"}
        descriptionClassName={`mb-2`}
        actionButton={
          <SkiButton href={`/login`} size={`lg`} variant={`primary`}>
            Log in
          </SkiButton>
        }
      />
    );
  }

  // In your CartView component
  // const { data: cartResponse = { data: { items: [], metadata: { total: 0 } }, isLoading, error, refetch } = useGetCart();
  // const cartItems = cartResponse.data.items;
  // const cartMetadata = cartResponse.data.metadata;

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId, {
      onSuccess: () => {
        toast.success("Item removed from cart");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to remove item", {
          description: error.message,
        });
      },
    });
  };

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => {
    const q = localQuantities[item.id] ?? item.quantity;
    return sum + (item.product.discountPrice || item.product.price || 0) * q;
  }, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <Wrapper>
        <CartViewSkeleton />
      </Wrapper>
    );
  }

  if (error) {
    return <ErrorState className={`mx-auto mt-30 max-w-[1240px]`} onRetry={() => refetch()} />;
  }

  return (
    <Wrapper>
      <p className="mb-6 !text-lg !font-bold sm:mb-8 sm:!text-4xl">
        Cart {cartMetadata && `(${cartMetadata.total} items)`}
      </p>

      {cartItems?.length === 0 ? (
        <EmptyState title={`No product avaliable`} description={`There are no product available in your cart`} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {isLoading && <CartViewSkeleton />}

          {!isLoading && (
            <>
              {/* Mobile Card View */}
              <div className="space-y-4 lg:hidden">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          <div className="relative flex h-full items-center justify-center text-gray-400">
                            <BlurImage alt={item?.name} fill src={item?.product.images[0]} />
                          </div>
                        </div>
                        <div>
                          <p className="!text-foreground !font-semibold">{item.product.name}</p>
                          <p className="text-mid-grey-I text-[10px] md:text-xs">SKU: {item.product.id}</p>
                          <div className="mt-2">
                            <div className="flex items-baseline gap-2">
                              {item.product.discountPrice ? (
                                <>
                                  <p className="!text-primary text-sm !font-semibold">
                                    {formatCurrency(item.product.discountPrice, locale)}
                                  </p>
                                  <p className="!text-destructive !text-xs !font-medium line-through">
                                    {formatCurrency(item.product.price, locale)}
                                  </p>
                                </>
                              ) : (
                                <p className="!text-primary !text-sm !font-semibold">
                                  {formatCurrency(item.product.price, locale)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isRemoving}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <SkiButton
                          isIconOnly
                          icon={<Minus className="h-4 w-4" />}
                          size={`icon`}
                          variant={`primary`}
                          onClick={() => handleLocalQuantityChange(item.id, "decrease")}
                          className="items-center justify-center rounded-none border disabled:opacity-50"
                          isDisabled={isUpdating}
                        />
                        <span className="bg-primary/10 flex h-[34px] w-20 items-center justify-center text-center font-medium">
                          {localQuantities[item.id] ?? item.quantity}
                        </span>
                        <SkiButton
                          isIconOnly
                          size={`icon`}
                          variant={`primary`}
                          onClick={() => handleLocalQuantityChange(item.id, "increase")}
                          className="items-center justify-center rounded-none border disabled:opacity-50"
                          icon={<Plus className="h-4 w-4" />}
                          isDisabled={isUpdating}
                        />
                      </div>
                      <p className="!text-primary !text-sm !font-semibold">
                        {formatCurrency(
                          (item.product.discountPrice || item.product.price || 0) *
                            (localQuantities[item.id] ?? item.quantity),
                          locale,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:col-span-2 lg:block">
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-medium"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {cartItems.map((item: CartItem) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-4">
                              <div className="border-border relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border dark:bg-[#111111]">
                                <div className="relative flex h-full items-center justify-center text-gray-400">
                                  <BlurImage alt={item?.name} fill src={item?.product.images[0]} />
                                </div>
                              </div>
                              <div>
                                <p className="!text-foreground !mb-0 !font-semibold">{item.product.name}</p>
                                <p className="!mb-0 text-[11px]">SKU: {item.product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-baseline gap-2">
                              {item.product.discountPrice ? (
                                <>
                                  <p className="!text-primary text-sm !font-semibold">
                                    {formatCurrency(item.product.discountPrice, locale)}
                                  </p>
                                  <p className="!text-destructive !text-xs !font-medium line-through">
                                    {formatCurrency(item.product.price, locale)}
                                  </p>
                                </>
                              ) : (
                                <p className="!text-primary !text-sm !font-semibold">
                                  {formatCurrency(item.product.price, locale)}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <SkiButton
                                isIconOnly
                                icon={<Minus className="h-4 w-4" />}
                                size={`icon`}
                                variant={`primary`}
                                onClick={() => handleLocalQuantityChange(item.id, "decrease")}
                                className="items-center justify-center rounded-none border disabled:opacity-50"
                                isDisabled={isUpdating}
                              />
                              <span className="bg-primary/10 flex h-[34px] w-20 items-center justify-center text-center font-medium">
                                {localQuantities[item.id] ?? item.quantity}
                              </span>
                              <SkiButton
                                isIconOnly
                                size={`icon`}
                                variant={`primary`}
                                onClick={() => handleLocalQuantityChange(item.id, "increase")}
                                className="items-center justify-center rounded-none border disabled:opacity-50"
                                icon={<Plus className="h-4 w-4" />}
                                isDisabled={isUpdating}
                              />
                            </div>
                          </td>
                          <td className="text-primary px-4 py-4 font-medium">
                            {formatCurrency(
                              (item.product.discountPrice || item.product.price || 0) *
                                (localQuantities[item.id] ?? item.quantity),
                              locale,
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <SkiButton
                              onClick={() => handleRemoveItem(item.id)}
                              isDisabled={isRemoving}
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 disabled:opacity-50"
                              aria-label="Remove item"
                              icon={<Trash2 className="h-5 w-5" />}
                              isIconOnly
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary (Visible on both mobile and desktop) */}
              <div className="lg:col-span-1">
                <div className="bg-background rounded-lg border p-6">
                  <p className="mb-4 !text-lg font-semibold sm:text-2xl">Cart Summary</p>
                  <hr className={`mb-5`} />
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal, locale)}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `${formatCurrency(shipping, locale)}`}</span>
                    </div> */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className={`text-mid-success`}>{formatCurrency(total, locale)}</span>
                      </div>
                    </div>
                  </div>
                  <SkiButton
                    href={`/shop/cart/checkout`}
                    variant="primary"
                    size="lg"
                    className="mt-6 w-full rounded-full"
                  >
                    Proceed to Checkout
                  </SkiButton>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Wrapper>
  );
};

const CartViewSkeleton = () => {
  return (
    <section className="">
      <Skeleton className="mb-6 h-8 w-48 sm:mb-8 sm:h-10" />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Mobile Card View Skeleton */}
        <div className="space-y-4 lg:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <div className="flex justify-between">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View Skeleton */}
        <div className="hidden lg:col-span-2 lg:block">
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Product", "Price", "Quantity", "Total", ""].map((header, index) => (
                    <th key={index} className="px-4 py-3 text-left text-sm font-medium">
                      <Skeleton className="h-5 w-24" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="mt-1 h-4 w-12" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-6 w-8" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-5 w-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary Skeleton */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-gray-50 p-6">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="mb-5 h-px w-full" />
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <Skeleton className="mt-6 h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
