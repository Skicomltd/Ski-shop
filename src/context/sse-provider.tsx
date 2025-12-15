"use client";

import { useNotifications, type UseNotificationsReturn } from "@/lib/sse/use-notifications";
import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo, type ReactNode } from "react";

type SSEContextValue = Pick<UseNotificationsReturn, "on" | "close" | "getStatus">;

const SSEContext = createContext<SSEContextValue | null>(null);

export function SSEProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const userId = session?.user?.id as string | undefined;
  const token = (session as any)?.accessToken as string | undefined;

  const api = useNotifications(userId, token);

  const value = useMemo<SSEContextValue>(
    () => ({
      on: api.on,
      close: api.close,
      getStatus: api.getStatus,
    }),
    [api.on, api.close, api.getStatus],
  );

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
}

export function useSSE(): SSEContextValue {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error("useSSE must be used within SSEProvider");
  }
  return context;
}
