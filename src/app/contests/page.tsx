"use client";

import { useState } from "react";
import Link from "next/link";
import { ContestCard, Contest } from "../../components/ContestCard";
import { useContests } from "../../hooks/useContests";

export default function ContestsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const {
    data: contestsData,
    isLoading,
    error,
    refetch,
  } = useContests(1, 20, filter);

  const contests = contestsData?.contests || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading contests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-400">
            <p>Error loading contests: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 slide-in-up">
          <div className="mb-6 md:mb-0">
            <h1 className="text-5xl font-bold text-white mb-3">
              <span className="aurora-gradient-text">Meme</span> Contests
            </h1>
            <p className="text-gray-300 text-lg">
              Discover and participate in community meme contests
            </p>
          </div>
          <Link
            href="/create-contest"
            className="aurora-gradient text-white px-8 py-4 rounded-xl hover:scale-105 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] float-animation"
          >
            + Create New Contest
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${
              filter === "all"
                ? "aurora-gradient text-white shadow-lg"
                : "glass text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
            }`}
          >
            All Contests
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${
              filter === "active"
                ? "aurora-gradient text-white shadow-lg"
                : "glass text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
            }`}
          >
            🔥 Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${
              filter === "completed"
                ? "aurora-gradient text-white shadow-lg"
                : "glass text-gray-300 hover:text-white border border-white/10 hover:border-white/30"
            }`}
          >
            ✅ Completed
          </button>
        </div>

        {/* Contest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map(
            (
              contest,
              index, // <-- FIXED: Using 'contests' state
            ) => (
              <div
                key={contest.id}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <ContestCard contest={contest} />
              </div>
            ),
          )}
        </div>

        {/* Empty State */}
        {contests.length === 0 && (
          <div className="text-center py-20 slide-in-up">
            <div className="glass-strong p-12 rounded-2xl border border-white/10 max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <svg
                  className="w-20 h-20 mx-auto text-[var(--aurora-cyan)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-white text-xl font-bold mb-4">
                No contests found
              </p>
              <p className="text-gray-400 mb-6">
                Be the first to create an amazing contest!
              </p>
              <Link
                href="/create-contest"
                className="aurora-gradient text-white px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-bold inline-block"
              >
                Create First Contest
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
