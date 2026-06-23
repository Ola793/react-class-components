import { QueryClient } from "@tanstack/react-query";
import { QUERY_TTL } from "./queryConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: QUERY_TTL,
      gcTime: QUERY_TTL,
      refetchOnWindowFocus: false,
    },
  },
});
