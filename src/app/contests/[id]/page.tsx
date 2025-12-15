// src/app/contests/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CreateProposalForm } from "../../../components/CreateProposalForm";
import { VotingInterface } from "../../../components/VotingInterface";
import { ProposalCard } from "../../../components/ProposalCard";
import { useContestContext } from "../../../hooks/useContestContext";
import {
  useContestDetails,
  useContestProposals,
} from "../../../hooks/useContestDetails";

export default function ContestDetailPage() {
  const params = useParams();
  const contestAddress = params.id as string;
  const [activeTab, setActiveTab] = useState<"proposals" | "submit" | "vote">(
    "proposals",
  );
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const voteSectionRef = useRef<HTMLDivElement | null>(null);

  const { setCurrentContest } = useContestContext();

  const {
    data: contestData,
    isLoading: contestLoading,
    error: contestError,
  } = useContestDetails(contestAddress);

  const {
    data: proposalsData,
    isLoading: proposalsLoading,
    error: proposalsError,
    refetch: refetchProposals,
  } = useContestProposals(contestAddress, sortBy);

  const contest = contestData?.contest
    ? {
        id: parseInt(contestData.contest.contestId),
        address: contestData.contest.address,
        title: contestData.contest.title || `Meme Contest #${contestData.contest.contestId}`,
        description: contestData.contest.description || "Community-driven meme competition. Submit your best memes and let the community vote!",
        creator: contestData.contest.creator,
        proposalCount: contestData.contest.proposalCount,
        totalVotes: contestData.contest.voteCount,
        endTime:
          parseInt(contestData.contest.contestStart) * 1000 +
          parseInt(contestData.contest.votingPeriod) * 1000,
        startTime: parseInt(contestData.contest.contestStart) * 1000,
        status: "active" as const,
      }
    : null;

  const proposals = proposalsData?.proposals || [];

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    // Set the current contest when page loads
    if (contestAddress) {
      setCurrentContest(contestAddress);
    }
  }, [contestAddress, setCurrentContest]);

  useEffect(() => {
    if (activeTab === "vote") {
      const timeout = setTimeout(() => {
        voteSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [activeTab]);

  const handleVoteClick = (proposalId: string) => {
    setSelectedProposalId(proposalId);
    setActiveTab("vote");
  };

  const handleVoteSubmitted = () => {
    // Refetch both proposals and contest details after voting
    refetchProposals();
    setActiveTab("proposals");
    setSelectedProposalId(null);
  };

  // Loading state
  if (contestLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading contest details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (contestError || !contest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-400">
            <h1 className="text-2xl font-bold mb-4">Contest Not Found</h1>
            <p>
              Error loading contest:{" "}
              {contestError?.message || "Contest not found"}
            </p>
            <Link
              href="/contests"
              className="inline-block mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Contests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Contest Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto p-8">
          <Link
            href="/contests"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            ← Back to Contests
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
              <p className="text-gray-300 mb-4">{contest.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Creator: </span>
                  <span className="font-mono">
                    {truncateAddress(contest.creator)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Proposals: </span>
                  <span>{contest.proposalCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Votes: </span>
                  <span>{contest.totalVotes}</span>
                </div>
                <div>
                  <span className="text-gray-400">Ends in: </span>
                  <span>
                    {Math.ceil(
                      (contest.endTime - Date.now()) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-full font-medium ${
                contest.status === "active"
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex space-x-8">
            {[
              { id: "proposals" as const, label: "Proposals" },
              { id: "submit" as const, label: "Submit Proposal" },
              { id: "vote" as const, label: "Vote" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "vote") {
                    setSelectedProposalId(null);
                  }
                }}
                className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
                {tab.id === "proposals" && (
                  <span className="ml-2 bg-gray-700 px-2 py-1 rounded-full text-xs">
                    {proposals.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto p-8">
        {activeTab === "proposals" && (
          <div>
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Proposals</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("votes")}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === "votes"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Most Votes
                </button>
                <button
                  onClick={() => setSortBy("recent")}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === "recent"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Most Recent
                </button>
              </div>
            </div>

            {/* Proposals List */}
            {proposalsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="mt-2">Loading proposals...</p>
              </div>
            ) : proposalsError ? (
              <div className="text-center text-red-400 py-8">
                <p>Error loading proposals: {proposalsError.message}</p>
                <button
                  onClick={() => refetchProposals()}
                  className="mt-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : proposals.length > 0 ? (
              <div className="grid gap-6">
                {proposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onVoteClick={() => handleVoteClick(proposal.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No proposals yet.</p>
                <button
                  onClick={() => setActiveTab("submit")}
                  className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Be the first to submit!
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "submit" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Submit Proposal</h2>
            <CreateProposalForm />
            <button
              onClick={() => setActiveTab("proposals")}
              className="mt-6 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Proposals
            </button>
          </div>
        )}

        {activeTab === "vote" && (
          <div ref={voteSectionRef}>
            <h2 className="text-2xl font-bold mb-6">Cast Your Vote</h2>

            {/* Show selected proposal info if available */}
            {selectedProposalId && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Voting on Proposal #{selectedProposalId}
                </h3>
                <p className="text-gray-300">
                  You selected to vote on proposal #{selectedProposalId}. Cast
                  your vote below.
                </p>
              </div>
            )}

            {/* Voting Interface with correct props */}
            <VotingInterface
              contestAddress={contestAddress}
              proposals={proposals}
            />

            <button
              onClick={() => {
                setActiveTab("proposals");
                setSelectedProposalId(null);
              }}
              className="mt-6 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Proposals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
