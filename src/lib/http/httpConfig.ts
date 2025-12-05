// Recommended to manage env vars in a config file
import axios, { type AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const TIMEOUTMSG = "Waiting for too long...Aborted!";

// Lightweight in-memory session cache to avoid spamming /api/auth/session on every request
type SessionShape = {
  accessToken?: string;
  refreshToken?: string;
  expires?: string;
} | null;

let cachedSession: SessionShape = null;
let sessionExpiry = 0;
let inFlight: Promise<SessionShape> | null = null;
const SESSION_SAFETY_WINDOW_MS = 60 * 1000; // refresh 1 min before expiry

async function getCachedSession(): Promise<SessionShape> {
  if (typeof window === "undefined") return null; // never fetch session in server runtime here

  const now = Date.now();
  if (cachedSession && sessionExpiry - SESSION_SAFETY_WINDOW_MS > now) {
    return cachedSession;
  }
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const s = await getSession();
      cachedSession = s as SessionShape;
      // next-auth gives ISO string in session.expires
      sessionExpiry = s?.expires ? new Date(s.expires).getTime() : now + 30 * 60 * 1000;
      return cachedSession;
    } catch {
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

// Only attach Authorization for requests going to our API origin
function shouldAttachAuthHeader(config: Pick<AxiosRequestConfig, "url" | "baseURL">): boolean {
  const url = config.url as string | undefined;
  if (!url) return true;

  // If absolute URL and different origin than baseURL, skip
  const isAbsolute = /^https?:\/\//i.test(url);
  if (isAbsolute) {
    try {
      const requestOrigin = new URL(url).origin;
      const baseOrigin = config.baseURL ? new URL(config.baseURL).origin : "";
      if (baseOrigin && requestOrigin !== baseOrigin) return false;
    } catch {
      return false;
    }
  }
  return true;
}

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeoutErrorMessage: TIMEOUTMSG,
  // Do NOT set default Content-Type here.
  // Axios will set 'application/json' for plain objects and proper multipart boundaries for FormData.
});

// Request interceptor for auth token and dynamic Content-Type
http.interceptors.request.use(
  async (config) => {
    const attachAuth = shouldAttachAuthHeader({
      url: config.url,
      baseURL: config.baseURL ?? process.env.NEXT_PUBLIC_BASE_URL,
    });

    if (attachAuth) {
      const session = await getCachedSession();
      if (session?.accessToken) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${session.accessToken}`;
      }
    }

    // Add client type header to all requests
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["x-client-type"] = "web";

    // If sending FormData, ensure Content-Type is not preset so browser can add the correct multipart boundary
    if (config.data instanceof FormData && config.headers) {
      // Remove any preset Content-Type to allow Axios/browser to set it correctly
      delete (config.headers as Record<string, unknown>)["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for 401 handling
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we got a 401, drop the cached session so the next request revalidates once
    if (error.response?.status === 401) {
      cachedSession = null;
      sessionExpiry = 0;
    }

    // Handle 401 Unauthorized from specific endpoints without throwing
    if (
      (error.response?.status === 401 && originalRequest?.url?.includes("/api/v1/carts")) ||
      (error.response?.status === 401 && originalRequest?.url?.includes("/api/v1/orders")) ||
      (error.response?.status === 401 && originalRequest?.url?.includes("/api/v1/products/saves"))
    ) {
      return; // Just return without throwing error
    }

    throw error;
  },
);

export default http;
