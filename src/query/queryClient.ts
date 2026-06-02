import { QueryClient } from '@tanstack/react-query';
import { QUERY_TTL } from './queryConfig';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_TTL,
      gcTime: QUERY_TTL,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});