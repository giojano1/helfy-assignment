import { QueryClient } from "@tanstack/react-query";

/**
 * Shared React Query client instance.
 *
 * Configuration:
 * - retry: 1 — retries failed requests once before surfacing the error
 * - staleTime: 30 000 ms — data is considered fresh for 30 seconds
 * - gcTime: 5 minutes — unused cache entries are garbage-collected after 5 min
 * - refetchOnWindowFocus: false — prevents aggressive refetching on tab switch
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
