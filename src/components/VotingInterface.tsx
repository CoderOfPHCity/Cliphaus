"use client";

import { useState } from "react";
import { CONTRACT_ABIS, DEFAULT_CONTEST_CONFIG } from "./constants/contracts";
import { useEthers } from "./provider/WalletProvider";
import { ethers, Contract } from "ethers";

interface Proposal {
  id: string;
  author: string;
  description: string;
  contentHash: string;
  votes: number;
}

interface VotingInterfaceProps {
  contestAddress: string;
  proposals: Proposal[];
}

export const VotingInterface = ({
  contestAddress,
  proposals,
}: VotingInterfaceProps) => {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState(1);

  const { signer, address } = useEthers();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const castVote = async () => {
    if (selectedProposal === null || voteCount < 1 || !signer) return;

    setIsLoading(true);
    setError(null);
    setIsConfirmed(false);

    try {
      const contestContract = new Contract(
        contestAddress,
        CONTRACT_ABIS.MEME_CONTEST,
        signer,
      );
      console.log(
        "Debug - Proposal ID:",
        selectedProposal,
        "Type:",
        typeof selectedProposal,
        "Vote Count:",
        voteCount,
      );

      const transaction = await contestContract.castVote(
        BigInt(selectedProposal),
        BigInt(voteCount),
        { value: 0 },
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Cast Your Votes</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Proposal
          </label>
          <select
            value={selectedProposal || ""}
            onChange={(e) => setSelectedProposal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Votes
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={voteCount}
            onChange={(e) => setVoteCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-sm text-gray-600">
          <p>Cost per vote: {DEFAULT_CONTEST_CONFIG.COST_TO_VOTE} ETH</p>
          <p>
            Total cost:{" "}
            {(
              parseFloat(DEFAULT_CONTEST_CONFIG.COST_TO_VOTE) * voteCount
            ).toFixed(4)}{" "}
            ETH
          </p>
        </div>

        <button
          onClick={castVote}
          // Update button disabled state and text
          disabled={isLoading || !address || selectedProposal === null}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {!address
            ? "Connect Wallet"
            : isLoading
              ? "Voting..."
              : isConfirmed
                ? "Vote Cast!"
                : "Cast Vote"}
        </button>

        {isConfirmed && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            Vote cast successfully!
          </div>
        )}
      </div>
    </div>
  );
};
