/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { useAppService } from "@/services/externals/app/use-app-service";

import { ProductBreadcrumb } from "../../../(home)/_components/product-breadcrumb";

const Orders = ({ headerStyle }: { title: string; headerStyle?: string; hasAction?: boolean }) => {
  const { useGetOrders } = useAppService();
  const { data: orderData, isLoading, isError, refetch } = useGetOrders();

  return (
    <section className="min-h-[480px] pt-18 lg:pt-[10rem]">
      <ProductBreadcrumb productTitle={`Orders`} />
      <Wrapper>
        <div className={cn(`mb-8 flex items-baseline justify-between`, headerStyle)}>
          <h3 className={cn("!text-lg md:!text-2xl", headerStyle)}>My Orders</h3>
        </div>

        {/* Error State */}
        {isError && <ErrorState onRetry={() => refetch()} />}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8">
            {Array.from({ length: 8 }).map((_, index: number) => {
              return <OrderCardSkeleton key={index} />;
            })}
          </div>
        )}

        {/* Empty State */}
        {!orderData?.data.items ||
          (orderData.data.items.length === 0 && (
            <EmptyState
              title="No orders yet"
              description="You haven't placed any orders yet. Start shopping to see your orders here."
              descriptionClassName={`mb-2`}
              actionButton={
                <SkiButton size={`lg`} href="/shop" variant="primary">
                  Start Shopping
                </SkiButton>
              }
            />
          ))}

        {/* Orders Grid */}
        {!isLoading && !isError && orderData?.data?.items && orderData.data.items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {(orderData.data.items as any[]).map((order: any) => {
              const firstImage = order.items?.[0]?.product?.images?.[0] as string | undefined;
              const itemsCount = Array.isArray(order.items)
                ? order.items.reduce((sum: number, it: any) => sum + (it?.quantity ?? 0), 0)
                : 0;
              const paid = order?.status === "paid";
              return (
                <div key={String(order?.id)} className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row">
                  {/* Thumbnail */}
                  <div className="bg-muted relative aspect-square w-full max-w-[140px] overflow-hidden rounded-lg">
                    {firstImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={firstImage}
                        alt={order?.items?.[0]?.product?.name ?? "Order thumbnail"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex w-full flex-col gap-3">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Reference</span>
                        <span className="text-sm font-medium">{order?.reference ?? "—"}</span>
                      </div>
                      <div className={cn("inline-flex items-center gap-2")}>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800",
                          )}
                        >
                          {paid ? "Paid" : "Pending"}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                          {order?.paymentMethod ?? "—"}
                        </span>
                      </div>
                    </div>

                    {/* Items list */}
                    <div className="space-y-2">
                      {Array.isArray(order.items) &&
                        order.items.map((it: any) => (
                          <div key={String(it?.id)} className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-3">
                              {/* Item thumbnail */}
                              <div className="bg-muted h-10 w-10 overflow-hidden rounded">
                                {it?.product?.images?.[0] ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={it.product.images[0]}
                                    alt={it.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-gray-200" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="truncate text-sm font-medium">
                                  {it?.product?.name ?? "Unnamed item"}
                                </span>
                                <span className="text-muted-foreground text-xs">Qty: {it?.quantity ?? 0}</span>
                              </div>
                            </div>
                            <div className="text-sm font-medium">₦{Number(it?.subtotal ?? 0).toLocaleString()}</div>
                          </div>
                        ))}
                    </div>

                    {/* Shipping & totals */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Items</span>
                        <span className="text-sm font-medium">{itemsCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Shipping to</span>
                        <span className="line-clamp-2 text-sm font-medium">
                          {order?.shippingInfo?.recipientAddress ?? "—"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-muted-foreground text-xs">Total</span>
                        <span className="text-base font-semibold">
                          ₦{Number(order?.totalAmount ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-muted-foreground text-xs">
                        Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
                        {paid && order?.paidAt ? ` • Paid ${new Date(order.paidAt).toLocaleString()}` : ""}
                      </div>
                      <div className="flex items-center gap-2">
                        <SkiButton size="sm" variant="outline" href={`/shop/cart/orders/${String(order?.id)}`}>
                          View Details
                        </SkiButton>
                        {!paid && (
                          <SkiButton
                            size="sm"
                            variant="primary"
                            isDisabled
                            href={`/checkout?ref=${String(order?.reference ?? "")}`}
                          >
                            Complete Payment
                          </SkiButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Wrapper>
    </section>
  );
};

const OrderCardSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-8 rounded-lg border p-4 lg:flex-row">
    {/* Product Image Skeleton */}
    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
      <div className="h-[400px] w-[400px] bg-gray-300"></div>
    </div>

    {/* Order Information Skeleton */}
    <div className="w-full space-y-2">
      {/* Order ID */}
      <div className="h-3 w-20 rounded bg-gray-200 lg:h-4"></div>

      {/* Product Title */}
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 lg:h-8"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 lg:h-8"></div>
      </div>

      {/* Ratings */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-4 w-4 rounded bg-gray-200"></div>
        ))}
      </div>

      {/* Status and Delivery Info */}
      <div className="mt-8 space-y-2">
        {/* Status Badge */}
        <div className="h-6 w-16 rounded-full bg-gray-200 lg:h-8"></div>

        {/* Delivery Date */}
        <div className="h-6 w-48 rounded bg-gray-200 lg:h-8"></div>
      </div>
    </div>

    {/* Button Skeleton */}
    <div className="h-10 w-32 rounded bg-gray-200 lg:h-12"></div>
  </div>
);

export default Orders;
