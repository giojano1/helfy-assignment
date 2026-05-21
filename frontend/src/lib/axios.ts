import axios from "axios";

/**
 * Pre-configured Axios instance for all API calls.
 *
 * - baseURL is read from VITE_API_BASE_URL environment variable.
 * - Request interceptor attaches the Bearer access token from the auth store.
 * - Response interceptor handles 401 errors: attempts silent token refresh,
 *   retries the original request once, then clears auth state and redirects
 *   to /login on second failure.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true, // send httpOnly refresh-token cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach access token
apiClient.interceptors.request.use(
  (config) => {
    // Access token is read lazily from the auth store to avoid circular imports.
    // The store is imported inline to break the potential circular dependency.
    try {
      // Dynamic import is not possible in a sync interceptor, so we read from
      // a module-level getter that the auth store registers on initialisation.
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Store not yet initialised — proceed without token
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// Track whether a refresh is already in flight to avoid concurrent refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// Endpoints that must never trigger a silent refresh attempt.
// The refresh endpoint itself + login/register (which legitimately return 401).
const SKIP_REFRESH_SUFFIXES = ["/auth/refresh", "/auth/login", "/auth/register"];

function shouldSkipRefresh(url: string): boolean {
  return SKIP_REFRESH_SUFFIXES.some((suffix) => url.endsWith(suffix));
}

// Response interceptor — silent token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    const requestUrl = originalRequest.url ?? "";

    // Never attempt refresh for auth endpoints — avoids infinite loops and
    // ensures login/register errors propagate normally to the calling mutation.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(requestUrl)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err: unknown) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use the full base URL so this call bypasses the apiClient interceptors
        const refreshUrl = `${import.meta.env.VITE_API_BASE_URL as string}/auth/refresh`;
        const { data } = await axios.post<{ data: { accessToken: string } }>(
          refreshUrl,
          {},
          { withCredentials: true },
        );

        const newToken = data.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError, null);
        // Clear auth state — AuthGuard will redirect to /login on its next render.
        // Never do window.location.href here: it causes an infinite reload loop
        // when useInitAuth fires on a page load with no valid session.
        clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Token accessor functions — registered by the auth store at runtime
// ---------------------------------------------------------------------------

let _getAccessToken: (() => string | null) | null = null;
let _setAccessToken: ((token: string) => void) | null = null;
let _clearAuth: (() => void) | null = null;

/**
 * Registers the auth store's token accessors with the Axios instance.
 * Must be called once during app initialisation (inside the auth store).
 *
 * @param get - Function that returns the current access token
 * @param set - Function that stores a new access token
 * @param clear - Function that clears all auth state
 */
export function registerAuthAccessors(
  get: () => string | null,
  set: (token: string) => void,
  clear: () => void,
): void {
  _getAccessToken = get;
  _setAccessToken = set;
  _clearAuth = clear;
}

function getAccessToken(): string | null {
  return _getAccessToken ? _getAccessToken() : null;
}

function setAccessToken(token: string): void {
  if (_setAccessToken) _setAccessToken(token);
}

function clearAuth(): void {
  if (_clearAuth) _clearAuth();
}

export default apiClient;
