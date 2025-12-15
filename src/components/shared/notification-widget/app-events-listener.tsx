"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSSE } from "@/context/sse-provider";
import type { INotificationPayload } from "@/lib/sse/use-notifications";
import { useEffect } from "react";
import { toast } from "sonner";

export const AppEventsListener = () => {
  const { on } = useSSE();

  useEffect(() => {
    const off = on("*", (payload: INotificationPayload) => {
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
    });

    return () => {
      off();
    };
  }, [on]);

  return null;
};
