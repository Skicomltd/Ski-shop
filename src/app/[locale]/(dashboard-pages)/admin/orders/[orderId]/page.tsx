"use client";

import { BackButton } from "@/components/shared/back-button";
import { Details } from "@/components/shared/details";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { formatCurrency, formatDate } from "@/lib/i18n/utils";
import { useDashboardOrderService } from "@/services/dashboard/vendor/orders/use-order-service";
import { use } from "react";

import { DashboardHeader } from "../../../_components/dashboard-header";
import { OrderDetailSkeleton } from "./_components/order-detail-skeleton";

interface OrderDetailPageProperties {
  params: Promise<{
    orderId: string;
    locale: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProperties) {
  const { orderId } = use(params);
  const { useGetOrderById } = useDashboardOrderService();
  const { data: orderResponse, isLoading, isError, refetch } = useGetOrderById(orderId);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !orderResponse?.data) {
    return <ErrorState className={`bg-background min-h-[calc(100vh-130px)]`} onRetry={() => refetch()} />;
  }

  const order = orderResponse.data;

  return (
    <section className={`space-y-8`}>
      <DashboardHeader
        title="Order Details"
        subtitle={`${order.reference} details`}
        showSubscriptionBanner={false}
        icon={<BackButton />}
      />
      {/* TODO: Add order-specific CSV download functionality */}

      <section className="space-y-6">
        <Details.Section className="shadow-sm" title="Order Details">
          <Details.Grid className={`lg:flex lg:justify-between`}>
            <Details.Item label="Order ID" value={order.reference} />
            <Details.Item label="Buyer Name" value={order.buyer.name} />
            <Details.Item label="Status" value={order.status} />
            <Details.Item label="Total Amount" value={formatCurrency(order.totalAmount)} />
            <Details.Item label="Payment Method" value={order.paymentMethod} />
            <Details.Item label="Paid At" value={order.paidAt ? formatDate(order.paidAt) : "Not paid"} />
            <Details.Item label="Items" value={`${order.items?.length ?? 0}`} />
            <Details.Item label="Created At" value={formatDate(order.createdAt)} />
          </Details.Grid>
        </Details.Section>
        <Details.Section className="shadow-sm" title="Order Items">
          {!order.items || order.items.length === 0 ? (
            <EmptyState
              title="No products in this order"
              description="This order has no products to display."
              descriptionClassName="mb-4"
            />
          ) : (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    {/* Optional thumbnail */}
                    {/* {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded object-cover" />
                    ) : null} */}
                    <div>
                      <h4 className="font-semibold">{item.product?.name || `Some product`}</h4>
                      <p className="text-sm text-gray-600">Vendor: {item.vendor?.name || `Unknown vendor`}</p>
                      <p className="text-sm text-gray-600">
                        Delivery: {item.deliveryStatus || `uninitiated`}
                        {item.deliveryNo ? ` • ${item.deliveryNo}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${item.subtotal ?? item.product?.price ?? 0}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity ?? 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Details.Section>
        {order.shippingInfo ? (
          <Details.Section className="shadow-sm" title="Shipping Info">
            <Details.Grid className={`lg:flex lg:justify-between`}>
              <Details.Item label="Recipient" value={order.shippingInfo.recipientName} />
              <Details.Item label="Email" value={order.shippingInfo.recipientEmail} />
              <Details.Item label="Phone" value={order.shippingInfo.recipientPhone} />
              <Details.Item label="Address" value={order.shippingInfo.recipientAddress} />
              <Details.Item label="State" value={order.shippingInfo.recipientState} />
              <Details.Item label="Shipping Fee" value={formatCurrency(order.shippingInfo.shippingFee ?? 0)} />
            </Details.Grid>
          </Details.Section>
        ) : null}
      </section>
    </section>
  );
}
