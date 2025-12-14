"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import SkiButton from "@/components/shared/button";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderTracking } from "@/modules/tracking";
import { OrderTrackingData, RiderInfo, TrackingStatus, TrackingStep } from "@/modules/tracking/types";
import { createTrackingData, updateTrackingStatus } from "@/modules/tracking/utils/tracking-utils";
// import { useAppService } from "@/services/externals/app/use-app-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface TrackingPageProperties {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function TrackingPage({ params }: TrackingPageProperties) {
  const { id } = use(params);
  // Using dummy response data instead of API hook
  const trackingResponse: {
    success: boolean;
    data: {
      id: string;
      product: { id: string; name: string; images: string[]; price: number };
      subtotal: number;
      quantity: number;
      deliveryStatus:
        | "pending"
        | "assigned"
        | "picked_up"
        | "in_transit"
        | "arrived_at_hub"
        | "out_for_delivery"
        | "delivered";
      deliveryNo: string;
      vendor: { id: string; name: string };
      history: Array<{
        orderStatus:
          | "pending"
          | "assigned"
          | "picked_up"
          | "in_transit"
          | "arrived_at_hub"
          | "out_for_delivery"
          | "delivered";
        statusCreationDate: string;
        statusDescription: string;
      }>;
    };
  } = {
    success: true,
    data: {
      id: "aafeca00-f03d-42f7-8779-2eced620c379",
      product: {
        id: "aafeca00-f03d-42f7-8779-2eced620c379",
        name: "Intelligent Plastic Table",
        images: [
          "https://loremflickr.com/300/300?lock=8075297932967936",
          "https://loremflickr.com/300/300?lock=3981228411715584",
          "https://picsum.photos/seed/EEq9c/300/300",
        ],
        price: 7000,
      },
      subtotal: 14_000,
      quantity: 2,
      deliveryStatus: "out_for_delivery",
      deliveryNo: "NOPB04122542",
      vendor: {
        id: "ed4b6ec0-3287-4aaa-9061-8cbc20fd360c",
        name: "Tobi Olanitori",
      },
      history: [
        {
          orderStatus: "pending",
          statusCreationDate: "2025-12-04 16:02:42",
          statusDescription: "Your item is yet to be picked up",
        },
        {
          orderStatus: "assigned",
          statusCreationDate: "2025-12-08 20:56:57",
          statusDescription: "A rider has been assigned to pick up this item",
        },
        {
          orderStatus: "picked_up",
          statusCreationDate: "2025-12-09 01:04:05",
          statusDescription: "Our rider has picked-up your item and is heading back to the office",
        },
        {
          orderStatus: "in_transit",
          statusCreationDate: "2025-12-12 09:15:34",
          statusDescription:
            "Your package is currently in transit - En Route to Ondo Hub and on its way to the specified hub where it will be delivered.",
        },
        {
          orderStatus: "arrived_at_hub",
          statusCreationDate: "2025-12-12 09:20:59",
          statusDescription: "Your package has arrived at our Ondo Hub and is being prepared for delivery",
        },
        {
          orderStatus: "out_for_delivery",
          statusCreationDate: "2025-12-12 09:23:37",
          statusDescription: "Your package is on its way to the delivery address.",
        },
        {
          orderStatus: "delivered",
          statusCreationDate: "2025-12-12 09:33:51",
          statusDescription: "Your package has been successfully delivered to the recipient.",
        },
      ],
    },
  };
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
        id,
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
  }, [trackingResponse?.data, id, trackingData]);

  const handleStatusUpdate = (status: TrackingStatus) => {
    if (trackingData) {
      const updatedTrackingData = updateTrackingStatus(trackingData, status);
      setTrackingData(updatedTrackingData);
    }
  };

  // const handleRateRider = async (rating: number, review?: string) => {
  //   // TODO: Implement rider rating API call
  //   // eslint-disable-next-line no-console
  // };

  // Dummy page: skip loading state

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

  if (!trackingData) {
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
              <Link href={`/dashboard/orders/${id}`}>
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
    <div className="pt-18 lg:pt-[10rem]">
      {/* Header */}
      {/* <Wrapper className="">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackButton />
            <h4 className="">Track Rider</h4>
          </div>
        </div>
      </Wrapper> */}

      <Wrapper className="mx-auto px-0">
        <OrderTracking
          trackingData={trackingData}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          onStatusUpdate={handleStatusUpdate}
          // onRateRider={handleRateRider}
        />
      </Wrapper>
    </div>
  );
}
