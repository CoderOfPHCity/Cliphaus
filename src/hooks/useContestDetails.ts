import { useQuery } from "@tanstack/react-query";
import { contestsApi } from "../utils/api/contestsApi";
import { contestKeys } from "./useContests";

export function useContestDetails(contestAddress: string) {
  return useQuery({
    queryKey: contestKeys.detail(contestAddress),
    queryFn: () => contestsApi.fetchContestDetails(contestAddress),
    enabled: !!contestAddress,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useContestProposals(
  contestAddress: string,
  sortBy: "votes" | "recent" = "votes",
  page: number = 1,
  limit: number = 50,
) {
  return useQuery({
    queryKey: ["proposals", contestAddress, { sortBy, page, limit }],
    queryFn: () =>
      contestsApi.fetchProposals(contestAddress, sortBy, page, limit),
    enabled: !!contestAddress,
    staleTime: 30 * 1000, // 30 seconds
  });
}
