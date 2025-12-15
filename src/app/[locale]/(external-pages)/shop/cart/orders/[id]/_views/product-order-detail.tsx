import { ProductBreadcrumb } from "@/app/[locale]/(external-pages)/(home)/_components/product-breadcrumb";
import { Wrapper } from "@/components/core/layout/wrapper";
import SkiButton from "@/components/shared/button";
import { RatingModal } from "@/components/shared/rating-modal";
import { Badge } from "@/components/ui/badge";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
// import { useLocale } from "next-intl";
import Image from "next/image";

interface ProductOrderDetailProperties {
  order: {
    id: string;
    status: string; // "paid" | "pending" | etc
    buyer: { id: string; name: string };
    items: Array<{
      id: string;
      product: { id: string; name: string; images: string[]; price: number };
      quantity: number;
      subtotal: number;
      deliveryStatus?: string; // item-level delivery status
      vendor?: { id: string; name: string };
    }>;
    shippingInfo?: {
      recipientAddress?: string;
      recipientName?: string;
      recipientPhone?: string;
      recipientEmail?: string;
      recipientState?: string;
      shippingFee?: number;
    };
    totalAmount?: number;
    createdAt: string;
    paidAt?: string | null;
    reference?: string;
    paymentMethod?: string;
  };
}

const handleRatingSubmit = (rating: number, review: string, productId: string) => {
  // Here you would typically send the rating and review to your API
  // Example API call:
  // await submitRating({ productId, rating, review });
  // For now, we'll just handle the success state in the modal
  // You can add your actual API call here
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { rating, review, productId };
};

export const ProductOrderDetail = ({ order }: ProductOrderDetailProperties) => {
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB") : "—";
  const baseDeliveryDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  if (order?.createdAt) baseDeliveryDate.setDate(baseDeliveryDate.getDate() + 5);

  // Totals
  const itemsSubtotal = (order.items ?? []).reduce((sum, it) => sum + (it.subtotal ?? 0), 0);
  const shippingFee = order.shippingInfo?.shippingFee ?? 0;
  const orderTotal = order.totalAmount ?? itemsSubtotal + shippingFee;

  // Currency formatting (default to NGN)
  const currency = "NGN" as const;
  const locale: Locale = "en" as unknown as Locale; // fallback; integrate with actual locale when available
  const fmt = (amount: number) => formatCurrency(amount, locale, currency);

  let anyPendingDelivery = false;
  let allDelivered = true;
  for (const it of order.items ?? []) {
    const status = it.deliveryStatus ?? "uninitiated";
    if (status === "pending" || status === "uninitiated") anyPendingDelivery = true;
    if (status !== "delivered") allDelivered = false;
  }

  return (
    <section className={`mt-18 lg:mt-[10rem]`}>
      <ProductBreadcrumb productTitle={`Order Details`} />
      <Wrapper>
        <div className={cn(`mb-8 flex items-baseline justify-between`)}>
          <h3 className={cn("!text-lg md:!text-2xl")}>Order Details</h3>
        </div>

        {/* Items list */}
        <div className="space-y-6">
          {order.items?.map((item) => {
            const product = item.product;
            const deliveryStatus = item.deliveryStatus ?? "uninitiated";
            const isDelivered = deliveryStatus === "delivered";
            const isPending = deliveryStatus === "pending" || deliveryStatus === "uninitiated";
            return (
              <div
                key={item.id}
                className={cn("flex flex-col items-center gap-8 rounded-lg border bg-no-repeat p-4 lg:flex-row")}
              >
                <div className="relative z-[-1] aspect-square w-full max-w-[360px] overflow-hidden rounded-lg lg:flex-1">
                  {product?.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product?.name ?? "Product"}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>

                <div className="w-full flex-1 space-y-2">
                  <p className="text-[10px] capitalize lg:text-sm">Order #{order.id}</p>
                  <p className="!text-foreground line-clamp-2 !text-lg !font-semibold lg:!text-xl">
                    {product?.name ?? "—"}
                  </p>
                  <p className="text-foreground !text-sm !font-medium lg:!text-base">QTY: {item.quantity ?? 0}</p>
                  {item?.vendor?.name && <p className={`text-sm underline`}>By {item.vendor.name}</p>}

                  <div className="mt-4 space-y-2">
                    <Badge
                      className={cn(
                        `text-[10px] capitalize lg:text-xs`,
                        isPending && "bg-[#C5A83C]",
                        order.status === "paid" && "bg-[#008000]",
                        isDelivered && "bg-mid-success",
                      )}
                    >
                      {deliveryStatus} delivery
                    </Badge>
                    {isDelivered && (
                      <p className={`text-sm`}>Delivered on {baseDeliveryDate.toLocaleDateString("en-GB")} </p>
                    )}
                    {isPending && (
                      <p className={`text-sm`}>To be delivered {baseDeliveryDate.toLocaleDateString("en-GB")}</p>
                    )}
                  </div>

                  {/* Item-level CTAs (hidden when uninitiated) */}
                  {deliveryStatus !== "uninitiated" && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {deliveryStatus !== "delivered" && (
                        <SkiButton
                          href={`/shop/cart/orders/${order.id}/tracking/${item.id}`}
                          variant="primary"
                          size="lg"
                          className="rounded-full"
                        >
                          Track Order
                        </SkiButton>
                      )}
                      {isDelivered && product && (
                        <RatingModal
                          product={{
                            id: product.id,
                            name: product.name,
                            images: product.images,
                            description: "Rate your product",
                          }}
                          onRatingSubmit={(rating, review) => handleRatingSubmit(rating, review, product.id)}
                          triggerStructure={
                            <SkiButton variant="secondary" size="lg" className="rounded-full">
                              Rate Product
                            </SkiButton>
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary and actions */}
        <div className="mt-8 space-y-3 rounded-lg border p-4">
          <p className={`text-sm`}>Placed On {orderDate}</p>
          <div className="flex items-center gap-2">
            {anyPendingDelivery && <Badge className="bg-[#C5A83C] text-xs">Pending delivery</Badge>}
            {order.status === "paid" && <Badge className="bg-[#008000] text-xs">Paid</Badge>}
            {allDelivered && <Badge className="bg-mid-success text-xs">Delivered</Badge>}
          </div>

          {/* Totals breakdown */}
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span className="text-base font-medium">{fmt(itemsSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Shipping Fee</span>
              <span className="text-base font-medium">{fmt(shippingFee)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-base">Total</span>
              <span className="text-primary text-xl font-semibold">{fmt(orderTotal)}</span>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};
