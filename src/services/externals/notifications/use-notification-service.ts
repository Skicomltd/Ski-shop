/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Notification, NotificationType } from "@/components/shared/notification-widget";
import { queryClient } from "@/lib/react-query/query-client";
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import {
  NotificationService,
  type GetNotificationsParameters,
  type RawNotificationsResponse,
} from "./notification.service";

function coerceNotificationType(value: unknown): NotificationType {
  const candidate = String(value ?? "info").toLowerCase();
  if (["info", "success", "warning", "error", "system"].includes(candidate)) {
    return candidate as NotificationType;
  }
  return "info";
}

function normaliseTimestamp(input: unknown): Date {
  if (input instanceof Date) return input;
  if (typeof input === "string" || typeof input === "number") {
    const date = new Date(input);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date();
}

/**
 * Best-effort normalisation from backend payload into `NotificationWidget` model.
 * Supports several common shapes used by SSE + REST responses.
 */
export function mapToWidgetNotifications(raw: RawNotificationsResponse): Notification[] {
  const items: any[] = Array.isArray((raw as any)?.data)
    ? (raw as any).data
    : Array.isArray(raw as any)
      ? (raw as any)
      : Array.isArray((raw as any)?.results)
        ? (raw as any).results
        : [];

  return items.map<Notification>((item: any) => {
    const id = String(item.id ?? item._id ?? crypto.randomUUID());

    const title = item.title ?? item.subject ?? item.data?.title ?? "Notification";

    const message = item.body ?? item.message ?? item.data?.body ?? item.data?.message ?? "";

    const level = item.level ?? item.type ?? item.data?.level ?? item.data?.type ?? "info";

    const isRead =
      typeof item.isRead === "boolean"
        ? item.isRead
        : typeof item.read === "boolean"
          ? item.read
          : Boolean(item.data?.isRead);

    const createdAt =
      item.createdAt ?? item.timestamp ?? item.created_at ?? item.data?.createdAt ?? item.data?.timestamp;

    const actionUrl = item.actionUrl ?? item.url ?? item.data?.actionUrl ?? item.data?.url;

    const avatar = item.avatar ?? item.imageUrl ?? item.iconUrl ?? item.data?.avatar ?? item.data?.imageUrl;

    return {
      id,
      title,
      message,
      type: coerceNotificationType(level),
      timestamp: normaliseTimestamp(createdAt),
      read: isRead,
      actionUrl,
      avatar,
      icon: undefined,
    };
  });
}

export const useNotificationService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<NotificationService>(
    dependencies.NOTIFICATION_SERVICE,
  );

  const useGetNotifications = (parameters?: GetNotificationsParameters, options?: any) =>
    useServiceQuery<Notification[], Error>(
      [...queryKeys.notifications.list(parameters)],
      async (service) => {
        const raw = await service.getNotifications(parameters);
        return mapToWidgetNotifications(raw);
      },
      {
        staleTime: 30 * 1000,
        ...options,
      },
    );

  const useMarkNotificationAsRead = (options?: any) =>
    useServiceMutation((service, variables: { id: string }) => service.markOneAsRead(variables.id), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.base() });
      },
      ...options,
    });

  const useUnmarkNotificationAsRead = (options?: any) =>
    useServiceMutation((service, variables: { id: string }) => service.unmarkOneAsRead(variables.id), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.base() });
      },
      ...options,
    });

  const useMarkAllAsRead = (options?: any) =>
    useServiceMutation((service) => service.markAllAsRead(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.base() });
      },
      ...options,
    });

  const useUnmarkAllAsRead = (options?: any) =>
    useServiceMutation((service) => service.unmarkAllAsRead(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.base() });
      },
      ...options,
    });

  const useClearAllNotifications = (options?: any) =>
    useServiceMutation((service) => service.clearAll(), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.base() });
      },
      ...options,
    });

  return {
    useGetNotifications,
    useMarkNotificationAsRead,
    useUnmarkNotificationAsRead,
    useMarkAllAsRead,
    useUnmarkAllAsRead,
    useClearAllNotifications,
  };
};
