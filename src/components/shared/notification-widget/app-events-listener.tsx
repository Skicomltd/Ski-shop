"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSSE } from "@/context/sse-provider";
import { EventRegistry, type INotificationPayload } from "@/lib/sse/use-notifications";
import { useEffect } from "react";
import { toast } from "sonner";

export const AppEventsListener = () => {
  const { on } = useSSE();

  useEffect(() => {
    const handleEvent = (payload: INotificationPayload) => {
      // Debug: inspect raw SSE payloads in the browser console
      // so we can verify shape and fields coming from the backend.
      // eslint-disable-next-line no-console
      console.log("[SSE] Notification event received", payload);

      const title = payload?.data?.title || "Notification";
      const body = payload?.data?.body || "";
      const description = body || payload.type;

      // Map basic severity levels to sonner variants if provided
      const level = (payload.data as any)?.level as "info" | "success" | "warning" | "error" | undefined;

      switch (level) {
        case "success": {
          toast.success(title, { description });
          break;
        }
        case "error": {
          toast.error(title, { description });
          break;
        }
        case "warning": {
          toast.warning?.(title, { description } as any) ?? toast(title, { description });
          break;
        }
        default: {
          toast.info?.(title, { description } as any) ?? toast(title, { description });
        }
      }
    };

    // Subscribe only to explicit events from the EventRegistry instead of a wildcard "*".
    const unsubscribers = [
      on(EventRegistry.ORDER_PLACED_PAID, handleEvent),
      on(EventRegistry.ORDER_PLACED_POD, handleEvent),
      on(EventRegistry.ORDER_PALCED_VENDOR, handleEvent),
      on(EventRegistry.ORDER_PALCED_CUSTOMER, handleEvent),
      on(EventRegistry.ORDER_DELIVERY_REQUESTED, handleEvent),
      on(EventRegistry.ORDER_PAID_AFTER_DELIVERY, handleEvent),
      on(EventRegistry.ORDER_STATUS_CHANGED, handleEvent),
    ];

    return () => {
      for (const off of unsubscribers) {
        off();
      }
    };
  }, [on]);

  return null;
};
