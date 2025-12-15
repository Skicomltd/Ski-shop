export type SSEEventType = "notification" | "log" | "progress" | "custom";

export interface BaseSSEEvent<TType extends SSEEventType = SSEEventType, TPayload = unknown> {
  id: string;
  type: TType;
  channel: string;
  timestamp: number;
  data: TPayload;
}

export interface NotificationPayload {
  title?: string;
  message: string;
  level?: "info" | "success" | "warning" | "error";
}

export interface LogPayload {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  context?: Record<string, unknown>;
}

export interface ProgressPayload {
  message?: string;
  percent: number; // 0-100
  step?: string;
  totalSteps?: number;
  currentStep?: number;
}

export type NotificationEvent = BaseSSEEvent<"notification", NotificationPayload>;
export type LogEvent = BaseSSEEvent<"log", LogPayload>;
export type ProgressEvent = BaseSSEEvent<"progress", ProgressPayload>;
export type CustomEvent = BaseSSEEvent<"custom", Record<string, unknown>>;

export type SSEEvent = NotificationEvent | LogEvent | ProgressEvent | CustomEvent;

export interface PublishBody {
  channel?: string; // default: "global"
  event: SSEEvent;
}
