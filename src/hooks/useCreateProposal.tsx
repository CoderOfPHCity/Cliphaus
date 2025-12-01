// hooks/useCreateProposal.tsx
"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers, Contract } from "ethers";
import { useEthers } from "../components/provider/WalletProvider";
import { useContestContext } from "./useContestContext";
import {
  CONTRACT_ABIS,
  DEFAULT_CONTEST_CONFIG,
} from "../components/constants/contracts";

export const useCreateProposal = () => {
  const { signer, address } = useEthers();
  const { currentContest } = useContestContext();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      description,
      contentHash,
      contestAddress,
    }: {
      description: string;
      contentHash: string;
      contestAddress?: string;
    }) => {
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

      // Wait for confirmation
      const receipt = await transaction.wait();
      return {
        receipt,
        transactionHash: transaction.hash,
        contestAddress: targetContest,
      };
    },
    onSuccess: (data) => {
      // Invalidate and refetch proposals for this contest
      queryClient.invalidateQueries({
        queryKey: ["proposals", data.contestAddress],
      });

      // Also invalidate contest details to refresh proposal count
      queryClient.invalidateQueries({
        queryKey: ["contest", data.contestAddress],
      });
    },
  });

  const createProposal = useCallback(
    async (
      description: string,
      contentHash: string,
      contestAddress?: string,
    ) => {
      return mutation.mutateAsync({ description, contentHash, contestAddress });
    },
    [mutation],
  );

  return {
    createProposal,
    isLoading: mutation.isPending,
    error: mutation.error,
    transactionHash: mutation.data?.transactionHash || null,
    currentContest,
    isSuccess: mutation.isSuccess,
  };
};
