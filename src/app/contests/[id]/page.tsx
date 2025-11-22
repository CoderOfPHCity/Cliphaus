// src/app/contests/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CreateProposalForm } from "../../../components/CreateProposalForm";
import { VotingInterface } from "../../../components/VotingInterface";
import { ProposalCard } from "../../../components/ProposalCard";
import { useContestContext } from "../../../hooks/useContestContext";

// Mock data - replace with actual contract calls
const mockContest = {
  id: 1,
  address: "0x2dEb56795F4b86e1EfF814Fd7c2b60f4beE2612A",
  title: "Best Crypto Meme 2024",
  description:
    "Submit your funniest crypto memes! The community will vote for the most hilarious and creative entries. Winners get ETH rewards and bragging rights!",
  creator: "0xabcdef1234567890abcdef1234567890abcdef12",
  proposalCount: 15,
  totalVotes: 245,
  endTime: Date.now() + 86400000, // 1 day from now
  startTime: Date.now() - 86400000, // Started 1 day ago
  status: "active" as const,
};

const mockProposals = [
  {
    id: 1,
    author: "0x123...abc",
    description: "When you see the gas fees...",
    contentHash: "QmTest1",
    votes: 45,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 2,
    author: "0x456...def",
    description: "Trying to explain Bitcoin to family",
    contentHash: "QmTest2",
    votes: 32,
    createdAt: Date.now() - 43200000,
  },
];

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params.id;
  const [activeTab, setActiveTab] = useState<"proposals" | "submit" | "vote">(
    "proposals",
  );
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(
    null,
  );
  const voteSectionRef = useRef<HTMLDivElement | null>(null);
  
  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const { setCurrentContest } = useContestContext();

  useEffect(() => {
    // Set the current contest when page loads
    setCurrentContest(mockContest.address);
  }, [setCurrentContest]);

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

  const handleVoteClick = (proposalId: number) => {
    setSelectedProposalId(proposalId);
    setActiveTab("vote");
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 slide-in-up">
          <Link
            href="/contests"
            className="inline-flex items-center text-[var(--aurora-cyan)] hover:text-[var(--aurora-green)] mb-6 transition-colors group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Contests
          </Link>

          <div className="glass-strong rounded-xl shadow-2xl p-8 mb-8 border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {mockContest.title}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">{mockContest.description}</p>
              </div>
              <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-bold border border-green-400/30 backdrop-blur-sm aurora-glow whitespace-nowrap">
                🔥 Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="glass p-4 rounded-lg border border-white/10">
                <span className="text-gray-400 block mb-1">Creator</span>
                <span
                  className="text-white font-mono font-bold"
                  title={mockContest.creator}
                >
                  {truncateAddress(mockContest.creator)}
                </span>
              </div>
              <div className="glass p-4 rounded-lg border border-white/10">
                <span className="text-gray-400 block mb-1">Proposals</span>
                <span className="text-[var(--aurora-cyan)] font-bold text-2xl">{mockContest.proposalCount}</span>
              </div>
              <div className="glass p-4 rounded-lg border border-white/10">
                <span className="text-gray-400 block mb-1">Total Votes</span>
                <span className="text-[var(--aurora-green)] font-bold text-2xl">{mockContest.totalVotes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("proposals")}
            className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${
              activeTab === "proposals"
                ? "aurora-gradient text-white shadow-lg"
                : "glass text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
            }`}
          >
            📋 View Proposals
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${
              activeTab === "submit"
                ? "aurora-gradient text-white shadow-lg"
                : "glass text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
            }`}
          >
            ✨ Submit Proposal
          </button>
          <button
            onClick={() => setActiveTab("vote")}
            className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${
              activeTab === "vote"
                ? "aurora-gradient text-white shadow-lg"
                : "glass text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
            }`}
          >
            🗳️ Vote
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "proposals" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProposals.map((proposal, index) => (
              <div key={proposal.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ProposalCard
                  proposal={proposal}
                  onVoteClick={() => handleVoteClick(proposal.id)}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "submit" && (
          <div className="slide-in-up">
            <CreateProposalForm />
          </div>
        )}

        {activeTab === "vote" && (
          <div className="slide-in-up" ref={voteSectionRef}>
            <VotingInterface
              contestAddress={mockContest.address}
              proposals={mockProposals}
              initialProposalId={selectedProposalId ?? undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
