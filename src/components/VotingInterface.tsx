"use client";

import { useEffect, useState } from "react";
import { CONTRACT_ABIS, DEFAULT_CONTEST_CONFIG } from "./constants/contracts";
import { useEthers } from "../hooks/useEthers";
import { ethers, Contract } from "ethers";

interface Proposal {
  id: number;
  author: string;
  description: string;
  contentHash: string;
  votes: number;
}

interface VotingInterfaceProps {
  contestAddress: string;
  proposals: Proposal[];
  initialProposalId?: number;
}

export const VotingInterface = ({
  contestAddress,
  proposals,
  initialProposalId,
}: VotingInterfaceProps) => {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState(1);

  const { signer, address } = useEthers();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (initialProposalId !== undefined && initialProposalId !== null) {
      setSelectedProposal(initialProposalId);
    }
  }, [initialProposalId]);

  const castVote = async () => {
    if (selectedProposal === null || voteCount < 1 || !signer) return;

    setIsLoading(true);
    setError(null);
    setIsConfirmed(false);

    try {
      const voteCost =
        parseFloat(DEFAULT_CONTEST_CONFIG.COST_TO_VOTE) * voteCount;

      const contestContract = new Contract(
        contestAddress,
        CONTRACT_ABIS.MEME_CONTEST,
        signer,
      );

      const transaction = await contestContract.castVote(
        BigInt(selectedProposal),
        BigInt(voteCount),
        { value: ethers.parseEther(voteCost.toString()) },
      );

      setTransactionHash(transaction.hash);

      // Wait for confirmation
      await transaction.wait();
      setIsConfirmed(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error casting vote:", err);
      setError(err.message || "Failed to cast vote");
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-strong rounded-xl shadow-2xl p-8 max-w-3xl mx-auto border border-white/10">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
          <span className="text-3xl">🗳️</span>
          Cast Your Votes
        </h3>
        <p className="text-gray-400">Select a proposal and choose how many votes to cast</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
            Select Proposal *
          </label>
          <select
            value={selectedProposal || ""}
            onChange={(e) => setSelectedProposal(Number(e.target.value))}
            className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-purple)] text-white transition-all duration-300 cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '3rem'
            }}
          >
            <option value="">Choose a proposal...</option>
            {proposals.map((proposal) => (
              <option key={proposal.id} value={proposal.id}>
                {proposal.description} ({proposal.votes} votes)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
            Number of Votes
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={voteCount}
            onChange={(e) => setVoteCount(Number(e.target.value))}
            className="w-full px-4 py-3 glass border border-white/20 rounded-lg focus:outline-none focus:border-[var(--aurora-purple)] text-white transition-all duration-300"
          />
        </div>

        <div className="glass rounded-xl p-6 border border-[var(--aurora-purple)]/30">
          <h4 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--aurora-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Voting Cost
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cost per vote:</span>
              <span className="text-white font-mono font-bold">{DEFAULT_CONTEST_CONFIG.COST_TO_VOTE} ETH</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-gray-400 font-bold">Total cost:</span>
              <span className="text-[var(--aurora-purple)] text-2xl font-bold font-mono">
                {(parseFloat(DEFAULT_CONTEST_CONFIG.COST_TO_VOTE) * voteCount).toFixed(4)} ETH
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={castVote}
          disabled={isLoading || !address || selectedProposal === null}
          className="w-full aurora-gradient text-white py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(136,68,255,0.6)]"
        >
          {!address
            ? "🔌 Connect Wallet"
            : isLoading
              ? "🔄 Voting..."
              : isConfirmed
                ? "✅ Vote Cast!"
                : "🗳️ Cast Vote"}
        </button>

        {error && (
          <div className="glass p-6 rounded-xl border border-red-400/50 slide-in-up">
            <p className="font-bold text-red-400 flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Error Casting Vote
            </p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        )}

        {isConfirmed && (
          <div className="glass p-6 rounded-xl border border-green-400/50 slide-in-up">
            <p className="font-bold text-green-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Vote cast successfully! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
