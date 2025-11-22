// hooks/useCreateProposal.tsx
"use client";

import { useCallback, useState } from "react";
import { ethers, Contract } from "ethers";
import { useEthers } from "./useEthers";
import { useContestContext } from "./useContestContext";
import {
  CONTRACT_ABIS,
  DEFAULT_CONTEST_CONFIG,
} from "../components/constants/contracts";

export const useCreateProposal = () => {
  const { signer, address } = useEthers();
  const { currentContest } = useContestContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const createProposal = useCallback(
    async (
      description: string,
      contentHash: string,
      contestAddress?: string,
    ) => {
      // Use provided contestAddress or fall back to current context
      const targetContest = contestAddress || currentContest;

      if (!targetContest) {
        throw new Error("No contest selected. Please select a contest first.");
      }

      if (!signer || !address) {
        throw new Error("Wallet not connected");
      }

      if (!description || !contentHash) {
        throw new Error("Description and content hash are required");
      }

      setIsLoading(true);
      setError(null);
      setTransactionHash(null);

      try {
        // Validate contract address
        if (!targetContest || !ethers.isAddress(targetContest)) {
          throw new Error("Invalid contest address. Please select a valid contest.");
        }

        const contestContract = new Contract(
          targetContest,
          CONTRACT_ABIS.MEME_CONTEST,
          signer,
        );

        const transaction = await contestContract.propose(
          description,
          contentHash,
          { value: ethers.parseEther(DEFAULT_CONTEST_CONFIG.COST_TO_PROPOSE) },
        );

        setTransactionHash(transaction.hash);

        // Wait for confirmation
        const receipt = await transaction.wait();
        setIsLoading(false);
        return receipt;
      } catch (err: any) {
        console.error("Error creating proposal:", err);
        setError(err.message || "Failed to create proposal");
        setIsLoading(false);
        throw err;
      }
    },
    [signer, address, currentContest],
  );

  return {
    createProposal,
    isLoading,
    error,
    transactionHash,
    currentContest,
  };
};
