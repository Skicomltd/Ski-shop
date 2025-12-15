"use client";

import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import { Wrapper } from "@/components/core/layout/wrapper";
import SkiButton from "@/components/shared/button";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderTracking } from "@/modules/tracking/components/order-tracking";
import { useAppService } from "@/services/externals/app/use-app-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface TrackingPageProperties {
  params: Promise<{
    orderId: string;
    orderItemId: string;
    locale: string;
  }>;
}

export default function TrackingPage({ params }: TrackingPageProperties) {
  const { orderId, orderItemId } = use(params);
  const { useTrackOrderById } = useAppService();
  const { data: trackingResponse } = useTrackOrderById(orderId, orderItemId);
  // Pass the real order data directly to the tracking component.

  if (!trackingResponse?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/orders"
                className="flex items-center text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">Back to Orders</span>
              </Link>
              <div className="hidden h-6 w-px bg-gray-300 sm:block" />
              <h1 className="!text-lg font-semibold text-gray-900 sm:!text-3xl">Track Rider</h1>
            </div>
          </div>
        </div>
        <Wrapper className="mx-auto px-0 py-4">
          <EmptyState
            images={[{ src: "/images/empty-state.svg", width: 80, height: 80, alt: "Error" }]}
            title="Order not found"
            description="The order you're looking for doesn't exist or has been removed."
            className="bg-mid-grey-I space-y-0 rounded-lg"
            titleClassName="!text-2xl"
            descriptionClassName="text-base mb-4"
            actionButton={
              <Link href="/dashboard/orders">
                <SkiButton variant="primary" size="lg">
                  Back to Orders
                </SkiButton>
              </Link>
            }
          />
        </Wrapper>
      </div>
    );
  }

  if (!trackingResponse?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="hidden h-6 w-px bg-gray-300 sm:block" />
              <h1 className="!text-lg font-semibold text-gray-900 sm:!text-3xl">Track Rider</h1>
            </div>
          </div>
        </div>
        <Wrapper className="mx-auto px-0 py-4">
          <EmptyState
            images={[{ src: "/images/empty-state.svg", width: 80, height: 80, alt: "No Tracking" }]}
            title="No tracking data available"
            description="This order doesn't have tracking information yet. Please assign a rider first."
            className="bg-mid-grey-I space-y-0 rounded-lg"
            titleClassName="!text-2xl"
            descriptionClassName="text-base mb-4"
            actionButton={
              <Link href={`/dashboard/orders/${orderId}`}>
                <SkiButton variant="primary" size="lg">
                  Back to Order
                </SkiButton>
              </Link>
            }
          />
        </Wrapper>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <Wrapper className="">
        <DashboardHeader title="Live Tracking" subtitle={`Order ID: ${trackingResponse.data.deliveryNo}`} />
      </Wrapper>

      <Wrapper className="mx-auto px-0">
        <OrderTracking order={trackingResponse.data} />
      </Wrapper>
    </div>
  );
}
