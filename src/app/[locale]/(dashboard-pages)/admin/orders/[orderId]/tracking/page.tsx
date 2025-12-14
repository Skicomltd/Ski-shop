"use client";

import { BackButton } from "@/components/shared/back-button";
import SkiButton from "@/components/shared/button";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { OrderTracking } from "@/modules/tracking";
import { OrderTrackingData, RiderInfo, TrackingStatus, TrackingStep } from "@/modules/tracking/types";
import { createTrackingData, updateTrackingStatus } from "@/modules/tracking/utils/tracking-utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { use, useEffect, useState } from "react";

interface TrackingPageProperties {
  params: Promise<{
    orderId: string;
    locale: string;
  }>;
}

export default function TrackingPage({ params }: TrackingPageProperties) {
  const { orderId } = use(params);
  const { useTrackOrderById } = useAppService();
  const { data: trackingResponse, isLoading, isError, refetch } = useTrackOrderById(orderId);
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null);

  // Initialize tracking data if not already set
  useEffect(() => {
    if (trackingResponse?.data && !trackingData) {
      const mockRiderInfo: RiderInfo = {
        id: "1",
        name: "Bola Xpress",
        phone: "0803 123 4567",
        rating: 4.7,
        reviews: 63,
        location: {
          lat: 6.5244,
          lng: 3.3792,
          address: "Lagos, Nigeria",
        },
      };

      // Map API shape into OrderTrackingData used by component
      const toTrackingStatus = (s: string): TrackingStatus => {
        switch (s) {
          case "pending": {
            return "order_confirmed";
          }
          case "assigned": {
            return "rider_accepted";
          }
          case "picked_up": {
            return "package_picked_up";
          }
          case "in_transit":
          case "out_for_delivery": {
            return "rider_on_way";
          }
          case "arrived_at_hub": {
            return "package_ready";
          }
          case "delivered": {
            return "package_delivered";
          }
          default: {
            return "order_confirmed";
          }
        }
      };
      const latestStatus = toTrackingStatus(trackingResponse.data.deliveryStatus);
      const newTrackingData = createTrackingData(
        orderId,
        trackingResponse.data.product?.name || "Product",
        mockRiderInfo,
        latestStatus,
      );

      const steps: TrackingStep[] = trackingResponse.data.history.map((h) => ({
        status: toTrackingStatus(h.orderStatus),
        title: h.orderStatus.replaceAll("_", " "),
        description: h.statusDescription,
        completed: true,
        timestamp: h.statusCreationDate,
      }));
      newTrackingData.steps = steps;

      setTrackingData(newTrackingData);
    }
  }, [trackingResponse?.data, orderId, trackingData]);

  const handleStatusUpdate = (status: TrackingStatus) => {
    if (trackingData) {
      const updatedTrackingData = updateTrackingStatus(trackingData, status);
      setTrackingData(updatedTrackingData);
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleRateRider = async (rating: number, review?: string) => {
    // TODO: Implement rider rating API call
    rating;
    review;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="bg-background h-96 rounded-lg"></div>
          <div className="bg-background h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (isError || !trackingResponse?.data) {
    return <ErrorState className={`!bg-background min-h-[calc(100vh-130px)]`} onRetry={() => refetch()} />;
  }

  if (!trackingData) {
    return (
      <EmptyState
        title="No tracking data available"
        description="This order doesn't have tracking information yet. Please assign a rider first."
        descriptionClassName="mb-4"
        actionButton={
          <SkiButton href={`/dashboard/orders/${orderId}`} variant="primary" size="lg">
            Back to Order
          </SkiButton>
        }
      />
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h4 className="">Track Rider</h4>
          </div>
        </div>
      </div>

      <section className="mx-auto px-0 py-4">
        <OrderTracking
          trackingData={trackingData}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          onStatusUpdate={handleStatusUpdate}
          onRateRider={handleRateRider}
        />
      </section>
    </div>
  );
}
