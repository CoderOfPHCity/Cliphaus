import axios from "axios";
import { Contest } from "../../components/ContestCard";

// Create axios instance
const api = axios.create({
  baseURL: "/api/indexer",
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message: string;
  status: string;
}

interface BackendContest {
  id: string;
  address: string;
  contestId: string;
  creator: string;
  contestStart: string;
  votingPeriod: string;
  votingDelay: string;
  state: number;
  costToPropose: string;
  costToVote: string;
  totalProposals: number;
  totalVotes: string;
  proposalCount: number;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  transactionHash: string;
  _count?: {
    proposals: number;
    votes: number;
  };
}

interface BackendProposal {
  id: string;
  proposalId: string;
  contestAddress: string;
  author: string;
  description: string;
  contentHash: string;
  totalVotes: string;
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: number;
  voteCount: number;
}

interface BackendVote {
  id: string;
  proposalId: string;
  contestAddress: string;
  voter: string;
  numVotes: string;
  cost: string;
  votedAt: string;
  createdAt: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: number;
  proposal?: {
    description: string;
    author: string;
  };
}

interface BackendStats {
  totalProposals: number;
  totalVotes: string;
  totalVoteTransactions: number;
  uniqueVoters: number;
  contestState: number;
}

interface LeaderboardEntry {
  rank: number;
  proposalId: string;
  author: string;
  description: string;
  totalVotes: string;
  contentHash: string;
}

export interface ProposalData {
  id: string;
  author: string;
  description: string;
  contentHash: string;
  votes: number;
  createdAt: number;
}

function transformContest(backendContest: BackendContest): Contest {
  const now = Date.now();
  const contestStart = parseInt(backendContest.contestStart) * 1000;
  const votingPeriod = parseInt(backendContest.votingPeriod) * 1000;
  const endTime = contestStart + votingPeriod;

  // Determine status
  let status: "upcoming" | "active" | "voting" | "completed" = "active";

  if (backendContest.state === 3 || backendContest.state === 2) {
    status = "completed";
  } else if (now < contestStart) {
    status = "upcoming";
  } else if (now >= contestStart && now < endTime) {
    status = "active";
  } else {
    status = "completed";
  }

  return {
    id: parseInt(backendContest.contestId),
    address: backendContest.address,
    title: `Meme Contest #${backendContest.contestId}`,
    description:
      "Community-driven meme competition. Submit your best memes and let the community vote!",
    creator: backendContest.creator,
    proposalCount: backendContest.proposalCount,
    totalVotes: backendContest.voteCount,
    endTime,
    startTime: contestStart,
    status,
  };
}

function transformProposal(backendProposal: BackendProposal): ProposalData {
  return {
    id: backendProposal.proposalId,
    author: backendProposal.author,
    description: backendProposal.description,
    contentHash: backendProposal.contentHash,
    votes:
      parseInt(backendProposal.totalVotes) || backendProposal.voteCount || 0,
    createdAt: new Date(backendProposal.createdAt).getTime(),
  };
}

export const contestsApi = {
  /**
   * Fetch all contests with optional filters
   */
  fetchContests: async (
    page: number = 1,
    limit: number = 20,
    statusFilter: "all" | "active" | "completed" = "all",
  ): Promise<{ contests: Contest[]; totalPages: number; total: number }> => {
    try {
      // let stateParam: number | undefined;

      // // Map status filter to backend state
      // if (statusFilter === "active") {
      //   stateParam = 1;
      // } else if (statusFilter === "completed") {
      //   stateParam = 2;
      // }

      // const params: any = { page, limit };
      // if (stateParam !== undefined) {
      //   params.state = stateParam;
      // }

      const params: any = { page, limit };


      const response = await api.get<ApiResponse<BackendContest[]>>(
        "/contests",
        { params },
      );

      const allContests = response.data.data.map(transformContest);

      // Filter by status based on time calculation
      const filteredContests = allContests.filter(contest => {
        if (statusFilter === "all") return true;
        return contest.status === statusFilter;
      });
      
      return {
        contests: filteredContests,
        totalPages: response.data.pagination?.pages || 1,
        total: filteredContests.length,
      };
    } catch (error) {
      console.error("Error fetching contests:", error);
      throw new Error("Failed to fetch contests");
    }
  },

  /**
   * Fetch single contest details
   */
  fetchContestDetails: async (
    address: string,
  ): Promise<{
    contest: BackendContest;
    stats: {
      proposalCount: number;
      voteCount: number;
      totalVotes: string;
    };
  }> => {
    try {
      const response = await api.get<ApiResponse<BackendContest>>(
        `/contests/${address}`,
      );

      return {
        contest: response.data.data,
        stats: {
          proposalCount: response.data.data.proposalCount,
          voteCount: response.data.data.voteCount,
          totalVotes: response.data.data.totalVotes,
        },
      };
    } catch (error) {
      console.error("Error fetching contest details:", error);
      throw new Error("Failed to fetch contest details");
    }
  },

  /**
   * Fetch proposals for a contest
   */
  fetchProposals: async (
    contestAddress: string,
    sortBy: "votes" | "recent" = "votes",
    page: number = 1,
    limit: number = 50,
  ): Promise<{
    proposals: ProposalData[];
    totalPages: number;
    total: number;
  }> => {
    try {
      const response = await api.get<ApiResponse<BackendProposal[]>>(
        `/contests/${contestAddress}/proposals`,
        {
          params: { sortBy, page, limit },
        },
      );

      const proposals = response.data.data.map(transformProposal);

      return {
        proposals,
        totalPages: response.data.pagination?.pages || 1,
        total: response.data.pagination?.total || proposals.length,
      };
    } catch (error) {
      console.error("Error fetching proposals:", error);
      throw new Error("Failed to fetch proposals");
    }
  },

  /**
   * Fetch leaderboard (top proposals)
   */
  fetchLeaderboard: async (
    contestAddress: string,
    limit: number = 10,
  ): Promise<LeaderboardEntry[]> => {
    try {
      const response = await api.get<ApiResponse<LeaderboardEntry[]>>(
        `/contests/${contestAddress}/leaderboard`,
        {
          params: { limit },
        },
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw new Error("Failed to fetch leaderboard");
    }
  },

  /**
   * Fetch contest statistics
   */
  fetchStats: async (contestAddress: string): Promise<BackendStats> => {
    try {
      const response = await api.get<ApiResponse<BackendStats>>(
        `/contests/${contestAddress}/stats`,
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw new Error("Failed to fetch contest statistics");
    }
  },

  /**
   * Fetch votes for a contest
   */
  fetchVotes: async (
    contestAddress: string,
    filters?: { proposalId?: string; voter?: string },
    page: number = 1,
    limit: number = 20,
  ): Promise<{ votes: BackendVote[]; totalPages: number; total: number }> => {
    try {
      const params: any = { page, limit };
      if (filters?.proposalId) params.proposalId = filters.proposalId;
      if (filters?.voter) params.voter = filters.voter;

      const response = await api.get<ApiResponse<BackendVote[]>>(
        `/contests/${contestAddress}/votes`,
        { params },
      );

      return {
        votes: response.data.data,
        totalPages: response.data.pagination?.pages || 1,
        total: response.data.pagination?.total || response.data.data.length,
      };
    } catch (error) {
      console.error("Error fetching votes:", error);
      throw new Error("Failed to fetch votes");
    }
  },

  /**
   * Fetch single proposal details
   */
  fetchProposalDetails: async (
    proposalId: string,
    contestAddress: string,
  ): Promise<{
    proposal: BackendProposal;
    recentVotes: BackendVote[];
  }> => {
    try {
      const response = await api.get<
        ApiResponse<{
          proposal: BackendProposal;
          recentVotes: BackendVote[];
        }>
      >(`/proposal/${proposalId}`, {
        /* ... */
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching proposal details:", error);
      throw new Error("Failed to fetch proposal details");
    }
  },

  /**
   * Fetch user activity
   */
  fetchUserActivity: async (
    userAddress: string,
  ): Promise<{
    contestsCreated: number;
    proposalsSubmitted: number;
    votesCast: number;
    recentProposals: any[];
    recentVotes: any[];
  }> => {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/user/${userAddress}/activity`,
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching user activity:", error);
      throw new Error("Failed to fetch user activity");
    }
  },
};

// Export default
export default contestsApi;
