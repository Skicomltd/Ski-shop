"use client";

import { Card, CardContent } from "@/components/ui/card";

import { TrackingStatus, TrackingStep } from "../types";
import { TrackingTimeline } from "./tracking-timeline";

interface OrderTrackingProperties {
  order: unknown;
}

// no-op: removed unused helper to satisfy linter

export const OrderTracking = ({ order }: OrderTrackingProperties) => {
  const o = order as {
    history?: Array<{ orderStatus: string; statusCreationDate: string; statusDescription: string }>;
    deliveryNo?: string;
    deliveryStatus?: string;
    product?: { name?: string };
  };

  const orderedApiStatuses = [
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "arrived_at_hub",
    "out_for_delivery",
    "delivered",
  ] as const;

  const statusMap = (s: string): TrackingStatus => {
    if (s === "pending") return "order_confirmed";
    if (s === "assigned") return "rider_accepted";
    if (s === "picked_up") return "package_picked_up";
    if (s === "in_transit" || s === "out_for_delivery") return "rider_on_way";
    if (s === "arrived_at_hub") return "package_ready";
    if (s === "delivered") return "package_delivered";
    return "order_confirmed";
  };

  // current status mapped (unused; kept for potential future use)
  // const _current = statusMap(o.deliveryStatus ?? "pending");
  const historyIndexByStatus: Record<TrackingStatus, number | undefined> = {
    order_confirmed: undefined,
    package_ready: undefined,
    rider_accepted: undefined,
    rider_at_vendor: undefined,
    package_picked_up: undefined,
    rider_on_way: undefined,
    package_delivered: undefined,
  };
  for (const [index, h] of (o.history ?? []).entries()) {
    const st = statusMap(h.orderStatus);
    historyIndexByStatus[st] = index;
  }

  const steps: TrackingStep[] = orderedApiStatuses.map((apiStatus) => {
    const mapped = statusMap(apiStatus);
    const histIndex = historyIndexByStatus[mapped];
    const hist = typeof histIndex === "number" ? o.history?.[histIndex] : undefined;
    const completed = typeof histIndex === "number";
    const titleWords = apiStatus.replaceAll("_", " ").split(" ");
    const title = titleWords.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
    return {
      status: mapped,
      title,
      description: hist?.statusDescription ?? "",
      completed,
      timestamp: hist?.statusCreationDate,
    };
  });

  return (
    <div className="space-y-6 px-4">
      {/* Tracking Timeline */}
      <Card className="shadow-none">
        <CardContent className="pt-6">
          <TrackingTimeline steps={steps} />
        </CardContent>
      </Card>
    </div>
  );
};
