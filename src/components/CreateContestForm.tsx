"use client";

import { useState, useEffect } from "react";
import { useMemeContestFactory } from "../hooks/useMemeContestFactory";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

export const CreateContestForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [votingPeriod, setVotingPeriod] = useState(7); // days
  const [costToPropose, setCostToPropose] = useState("0.01");
  const [costToVote, setCostToVote] = useState("0.001");
  const [maxProposals, setMaxProposals] = useState(100);

  const router = useRouter();

  // Add transactionHash to the hook destructuring
  const { createContest, isLoading, error, transactionHash } =
    useMemeContestFactory();

  // Add useEffect for successful transaction
  useEffect(() => {
    if (transactionHash) {
      setTimeout(() => {
        router.push("/contests");
      }, 2000);
    }
  }, [transactionHash, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createContest({
      votingPeriod: votingPeriod * 24 * 60 * 60,
      costToPropose: ethers.parseEther(costToPropose),
      costToVote: ethers.parseEther(costToVote),
      maxProposalCount: maxProposals,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-strong rounded-xl shadow-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold mb-8 text-white">
          Contest Configuration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                Contest Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-cyan)] text-white placeholder-gray-500 transition-all duration-300"
                placeholder="e.g., Best Crypto Meme 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-cyan)] text-white placeholder-gray-500 transition-all duration-300 resize-none"
                placeholder="Describe your contest theme, rules, and any special requirements..."
                required
              />
            </div>
          </div>

          {/* Contest Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                Voting Period (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={votingPeriod}
                onChange={(e) => setVotingPeriod(Number(e.target.value))}
                className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-cyan)] text-white transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                Max Proposals
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={maxProposals}
                onChange={(e) => setMaxProposals(Number(e.target.value))}
                className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-cyan)] text-white transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                Cost to Propose (ETH)
              </label>
              <input
                type="text"
                value={costToPropose}
                onChange={(e) => setCostToPropose(e.target.value)}
                className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-cyan)] text-white placeholder-gray-500 transition-all duration-300"
                placeholder="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                Cost to Vote (ETH)
              </label>
              <input
                type="text"
                value={costToVote}
                onChange={(e) => setCostToVote(e.target.value)}
                className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-cyan)] text-white placeholder-gray-500 transition-all duration-300"
                placeholder="0.001"
              />
            </div>
          </div>

          {/* Cost Summary */}
          <div className="glass rounded-xl p-6 border border-[var(--aurora-purple)]/30">
            <h4 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[var(--aurora-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Cost Summary
            </h4>
            <div className="text-sm text-gray-300 space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-[var(--aurora-cyan)]">•</span>
                Proposal submission:{" "}
                <span className="font-mono font-bold text-white">
                  {costToPropose} ETH
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[var(--aurora-green)]">•</span>
                Per vote:{" "}
                <span className="font-mono font-bold text-white">
                  {costToVote} ETH
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[var(--aurora-purple)]">•</span>
                Voting period:{" "}
                <span className="font-bold text-white">
                  {votingPeriod} days
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[var(--aurora-cyan)]">•</span>
                Maximum proposals:{" "}
                <span className="font-bold text-white">{maxProposals}</span>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full aurora-gradient text-white py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,136,0.6)]"
          >
            {isLoading
              ? "Creating Contest..."
              : transactionHash
                ? "✓ Contest Created!"
                : "🚀 Create Contest"}
          </button>

          {/* Status Messages */}
          {transactionHash && (
            <div className="glass p-6 rounded-xl border border-green-400/50 slide-in-up">
              <p className="font-bold text-green-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Contest created successfully!
              </p>
              <p className="text-sm text-gray-300 mt-2">
                Redirecting to contests page...
              </p>
            </div>
          )}

          {error && (
            <div className="glass p-6 rounded-xl border border-red-400/50 slide-in-up">
              <p className="font-bold text-red-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Error creating contest
              </p>
              <p className="text-sm text-gray-300 mt-2">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
