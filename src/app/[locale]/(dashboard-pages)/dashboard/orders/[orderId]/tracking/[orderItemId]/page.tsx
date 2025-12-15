"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { Wrapper } from "@/components/core/layout/wrapper";
import { BackButton } from "@/components/shared/back-button";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { OrderTracking } from "@/modules/tracking/components/order-tracking";
import { useAppService } from "@/services/externals/app/use-app-service";
import Link from "next/link";
import { use } from "react";

interface TrackingPageProperties {
  params: Promise<{
    orderId: string;
    orderItemId: string;
    locale: string;
  }>;
}

const getDeliveryStatusColor = (status: string) => {
  switch (status) {
    case "pending":
    case "uninitiated": {
      return "bg-yellow-500 text-white";
    }
    case "assigned":
    case "picked_up": {
      return "bg-blue-500 text-white";
    }
    case "in_transit":
    case "out_for_delivery": {
      return "bg-indigo-500 text-white";
    }
    case "arrived_at_hub": {
      return "bg-purple-500 text-white";
    }
    case "delivered": {
      return "bg-green-500 text-white";
    }
    default: {
      return "bg-gray-500 text-white";
    }
  }
};

export default function TrackingPage({ params }: TrackingPageProperties) {
  const { orderId, orderItemId, locale } = use(params);
  const { useTrackOrderById } = useAppService();
  const { data: trackingResponse, isLoading, isError, refetch } = useTrackOrderById(orderId, orderItemId);
  // Pass the real order data directly to the tracking component.

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-130px)]">
        <div className="animate-pulse space-y-4">
          <div className="bg-background h-10 w-48 rounded-md" />
          <div className="bg-background h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-130px)]">
        <Wrapper className="mx-auto px-0 py-4">
          <ErrorState
            title="Error loading tracking information"
            description="There was a problem fetching the tracking details. Please try again later."
            onRetry={refetch}
            className="!bg-background space-y-4 rounded-lg"
          />
        </Wrapper>
      </div>
    );
  }

  if (!trackingResponse?.data) {
    return (
      <div className="min-h-[calc(100vh-130px)]">
        <Wrapper className="mx-auto px-0 py-4">
          <EmptyState
            images={[{ src: "/images/empty-state.svg", width: 80, height: 80, alt: "No tracking data" }]}
            title="No tracking data yet"
            description="This order doesn't have tracking information yet. Once delivery is requested and a rider is assigned, live tracking will appear here."
            className="bg-mid-grey-I space-y-0 rounded-lg"
            titleClassName="!text-2xl"
            descriptionClassName="text-base mb-4"
            actionButton={
              <Link href={`/${locale}/dashboard/orders/${orderId}`}>
                <SkiButton variant="primary" size="lg">
                  Back to Order Details
                </SkiButton>
              </Link>
            }
          />
        </Wrapper>
      </div>
    );
  }

  const order = trackingResponse.data;
  const rawStatus = order.deliveryStatus ?? "";
  const normalizedStatus = rawStatus.replaceAll("_", " ");
  const friendlyStatus =
    normalizedStatus.length > 0
      ? normalizedStatus
          .split(" ")
          .map((word: string) => (word ? word[0]?.toUpperCase() + word.slice(1) : word))
          .join(" ")
      : "Unknown";
  const statusColorClass = getDeliveryStatusColor(rawStatus);
  const currentHistoryEntry = (order.history ?? []).find(
    (entry: { orderStatus: string }) => entry.orderStatus.replaceAll("_", " ") === normalizedStatus,
  );

  return (
    <div className="">
      {/* Header */}
      <Wrapper className="!m-0">
        <DashboardHeader
          title="Live Tracking"
          subtitle={`Order ID: ${order.deliveryNo}`}
          icon={<BackButton />}
          actionComponent={
            rawStatus ? (
              <Badge className={`rounded-full px-3 py-1 text-xs font-medium ${statusColorClass}`}>
                {friendlyStatus}
              </Badge>
            ) : null
          }
        />

        {currentHistoryEntry && (
          <div className="bg-primary/5 border-primary/10 text-muted-foreground mt-4 rounded-lg border px-3 py-3 text-xs md:text-sm">
            <p className="text-primary mb-1 font-medium">Status details</p>
            <p>{currentHistoryEntry.statusDescription}</p>
          </div>
        )}
      </Wrapper>

      <Wrapper className="mx-auto p-0">
        <OrderTracking order={order} />
      </Wrapper>
    </div>
  );
}
