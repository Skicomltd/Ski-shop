"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventSource } from "eventsource";
import { useCallback, useEffect, useRef } from "react";

export const EventRegistry = {
  ORDER_PLACED_PAID: "order.placed.paid",
  ORDER_PLACED_POD: "order.placed.pod", // payment on delivery
  ORDER_PALCED_VENDOR: "order.placed.vendor",
  ORDER_PALCED_CUSTOMER: "order.placed.customer",

  ORDER_DELIVERY_REQUESTED: "order.delivery.requested",
  ORDER_PAID_AFTER_DELIVERY: "order.paid.after_delivery",

  ORDER_STATUS_CHANGED: "order.status.change",
} as const;

export type EventNameType = (typeof EventRegistry)[keyof typeof EventRegistry];

export interface NotificationData<T = any> {
  title: string;
  body: string;
  metadata?: T;
}

export interface INotificationPayload<T = any> {
  type: string;
  data: NotificationData<T>;
  timestamp: string;
}

type Status = "idle" | "connecting" | "open" | "error" | "closed";

type Handler<T = any> = (payload: INotificationPayload<T>, raw: MessageEvent<string>) => void;

// Normalize server payload shape. Supports:
// 1) { type, data, timestamp }
// 2) { data: { type, data, timestamp } }
function unwrapPayload(input: unknown): INotificationPayload {
  const object = input as Record<string, unknown> | null;
  if (
    object &&
    typeof object === "object" &&
    "data" in object &&
    object.data &&
    typeof (object as any).data === "object" &&
    "type" in (object as any).data
  ) {
    return (object as any).data as INotificationPayload;
  }
  return input as INotificationPayload;
}

export function useNotifications(userId?: string, token?: string) {
  const sourceReference = useRef<EventSource | null>(null);
  const statusReference = useRef<Status>("idle");
  const listenersReference = useRef<Map<string, Set<Handler>>>(new Map());
  const wildcardReference = useRef<Set<Handler>>(new Set());

  const close = useCallback(() => {
    const source = sourceReference.current;
    if (source) {
      source.close();
      sourceReference.current = null;
      statusReference.current = "closed";
    }
  }, []);

  const on = useCallback(<T = any>(event: EventNameType | string | "*", handler: Handler<T>) => {
    if (event === "*") {
      wildcardReference.current.add(handler as Handler);
      return () => {
        wildcardReference.current.delete(handler as Handler);
      };
    }
    const key = String(event);
    let set = listenersReference.current.get(key);
    if (!set) {
      set = new Set();
      listenersReference.current.set(key, set);
    }
    set.add(handler as Handler);
    return () => {
      const set_ = listenersReference.current.get(key);
      if (!set_) return;
      set_.delete(handler as Handler);
      if (set_.size === 0) listenersReference.current.delete(key);
    };
  }, []);

  const emit = useCallback((eventName: string, payload: INotificationPayload, raw: MessageEvent<string>) => {
    const specific = listenersReference.current.get(eventName);
    if (specific) {
      for (const function_ of specific) {
        try {
          function_(payload, raw);
        } catch {
          // no-op for individual handler errors
        }
      }
    }
    if (wildcardReference.current.size > 0) {
      for (const function_ of wildcardReference.current) {
        try {
          function_(payload, raw);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!userId || !token) {
      close();
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      statusReference.current = "error";
      return;
    }

    statusReference.current = "connecting";

    const normalizedBase = baseUrl.replace(/\/$/, "");
    const url = `${normalizedBase}/notifications/users/${userId}`;

    const eventSource = new EventSource(url, {
      fetch: (input: any, init: any) => {
        return fetch(input, {
          ...init,
          headers: {
            ...init.headers,
            Authorization: `Bearer ${token}`,
            "x-client-type": "web",
          },
        });
      },
    } as any);

    sourceReference.current = eventSource;

    eventSource.addEventListener("open", () => {
      statusReference.current = "open";
    });

    eventSource.addEventListener("error", () => {
      statusReference.current = "error";
    });

    // Default messages where the server does not set a named SSE event
    eventSource.addEventListener("message", (event_: MessageEvent<string>) => {
      try {
        const raw = JSON.parse(event_.data) as unknown;
        const payload: INotificationPayload = unwrapPayload(raw);
        const eventName = payload?.type ?? "message";
        emit(eventName, payload, event_);
      } catch {
        // ignore parse error
      }
    });

    // Also listen to known event names explicitly if the server uses SSE "event:" names
    for (const eventName of Object.values(EventRegistry)) {
      eventSource.addEventListener(eventName, (event_: MessageEvent<string>) => {
        try {
          const raw = JSON.parse(event_.data) as unknown;
          const payload: INotificationPayload = unwrapPayload(raw);
          emit(eventName, payload, event_);
        } catch {
          // ignore parse error
        }
      });
    }

    return () => {
      eventSource.close();
      sourceReference.current = null;
      statusReference.current = "closed";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  const getStatus = useCallback(() => statusReference.current, []);

  return { on, close, getStatus };
}

export type UseNotificationsReturn = ReturnType<typeof useNotifications>;
