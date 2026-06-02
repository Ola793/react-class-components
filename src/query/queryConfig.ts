const DEFAULT_QUERY_TTL = 5 * 60 * 1000;

export const QUERY_TTL = Number(
  import.meta.env.VITE_QUERY_TTL ?? DEFAULT_QUERY_TTL
);