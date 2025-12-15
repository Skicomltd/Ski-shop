/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpAdapter } from "@/lib/http/http-adapter";

export interface GetNotificationsParameters {
  isRead?: boolean;
}

export type RawNotificationsResponse = any;

/**
 * HTTP wrapper around the notifications REST endpoints.
 *
 * The exact payload shape is normalised in the view layer, so this service
 * returns the raw backend data.
 */
export class NotificationService {
  private readonly http: HttpAdapter;

  private static readonly BASE_PATH = "/notifications";

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getNotifications(parameters?: GetNotificationsParameters): Promise<RawNotificationsResponse> {
    const query: Record<string, string | number | boolean> = {};

    if (typeof parameters?.isRead === "boolean") {
      query.isRead = parameters.isRead;
    }

    const response = await this.http.get<RawNotificationsResponse>(NotificationService.BASE_PATH, query);

    return response?.data ?? [];
  }

  /** Mark all notifications as read. */
  async markAllAsRead(): Promise<void> {
    await this.http.patch(`${NotificationService.BASE_PATH}/read-all`);
  }

  /** Mark all notifications as unread. */
  async unmarkAllAsRead(): Promise<void> {
    await this.http.patch(`${NotificationService.BASE_PATH}/unread-all`);
  }

  /** Mark a single notification as read. */
  async markOneAsRead(id: string): Promise<void> {
    await this.http.patch(`${NotificationService.BASE_PATH}/${id}/read`);
  }

  /** Mark a single notification as unread. */
  async unmarkOneAsRead(id: string): Promise<void> {
    await this.http.patch(`${NotificationService.BASE_PATH}/${id}/unread`);
  }

  /**
   * Clear all notifications for the user.
   *
   * If the backend exposes a dedicated clear endpoint it can be wired here.
   * For now we fall back to "mark all as read" semantics.
   */
  async clearAll(): Promise<void> {
    await this.markAllAsRead();
  }
}
