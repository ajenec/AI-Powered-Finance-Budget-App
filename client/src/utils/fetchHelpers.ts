import { TOKEN_KEY } from "./token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export function getAuthHeaders(extraHeaders: Record<string, string> = {}) {
  // Read token using the shared key used across the app.
  const token = localStorage.getItem(TOKEN_KEY);
  return token
    ? { ...extraHeaders, Authorization: `Bearer ${token}` }
    : { ...extraHeaders };
}

export const basicFetchOptions = () => ({
  method: "GET",
  headers: getAuthHeaders(),
});

export const getDeleteOptions = () => ({
  method: "DELETE",
  headers: getAuthHeaders(),
});

// Accept arbitrary payload shapes (unknown) — callers will provide typed objects
export const getPostOptions = (body: unknown) => ({
  method: "POST",
  headers: getAuthHeaders({ "Content-Type": "application/json" }),
  body: JSON.stringify(body as any),
});

export const getPatchOptions = (body: unknown) => ({
  method: "PATCH",
  headers: getAuthHeaders({ "Content-Type": "application/json" }),
  body: JSON.stringify(body as any),
});

export const getPutOptions = (body: unknown) => ({
  method: "PUT",
  headers: getAuthHeaders({ "Content-Type": "application/json" }),
  body: JSON.stringify(body as any),
});

export const fetchHandler = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000
) => {
  try {
    // Ensure URL starts with /api for proxy routing
    const fullUrl = url.startsWith("/api") ? url : `${API_BASE_URL}${url}`;

    // Do not mutate caller's options
    const opts: RequestInit = { ...options };

    // If caller provided a signal, respect it. Otherwise create one and attach a timeout.
    let timeoutId: number | undefined;
    if (!(opts as any).signal) {
      const controller = new AbortController();
      opts.signal = controller.signal;
      // Use window.setTimeout so typing matches browser environment
      timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    }

    const response = await fetch(fullUrl, opts);

    // Clear timeout if fetch completed
    if (typeof timeoutId !== "undefined") {
      clearTimeout(timeoutId);
    }

    const { ok, status, statusText, headers } = response;

    if (!ok) {
      // Create a proper error object with response data
      const error = new Error(`HTTP ${status}: ${statusText}`);
      (
        error as unknown as {
          response: { status: number; statusText: string; data: unknown };
        }
      ).response = {
        status,
        statusText,
        data: await response.json().catch(() => ({ error: statusText })),
      };
      throw error;
    }
    const isJson = (headers.get("content-type") || "").includes(
      "application/json"
    );
    const responseData = await (isJson ? response.json() : response.text());
    return [responseData, null];
  } catch (error: any) {
    // Normalize AbortError to a clearer error object
    if (error && error.name === "AbortError") {
      const abortErr = new Error("Request aborted (timeout or cancelled)");
      (abortErr as any).code = "ABORT";
      console.warn("fetchHandler aborted:", error);
      return [null, abortErr];
    }
    console.warn("fetchHandler error:", error);
    return [null, error];
  }
};
