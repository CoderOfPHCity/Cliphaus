import { useQuery, useQueryClient } from "@tanstack/react-query";
import { contestsApi } from "../utils/api/contestsApi";
import { Contest } from "../components/ContestCard";

// Query keys for better cache management
export const contestKeys = {
  all: ["contests"] as const,
  lists: () => [...contestKeys.all, "list"] as const,
  list: (filters: { status: string; page: number; limit: number }) =>
    [...contestKeys.lists(), filters] as const,
  details: () => [...contestKeys.all, "detail"] as const,
  detail: (id: string) => [...contestKeys.details(), id] as const,
};

// Hook to fetch contests with filters
export function useContests(
  page: number = 1,
  limit: number = 20,
  filter: "all" | "active" | "completed" = "all",
) {
  return useQuery({
    queryKey: contestKeys.list({ status: filter, page, limit }),
    queryFn: () => contestsApi.fetchContests(page, limit, filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to prefetch contests
export function usePrefetchContests() {
  const queryClient = useQueryClient();

  return (filter: "all" | "active" | "completed" = "all") => {
    queryClient.prefetchQuery({
      queryKey: contestKeys.list({ status: filter, page: 1, limit: 20 }),
      queryFn: () => contestsApi.fetchContests(1, 20, filter),
    });
  };
}
