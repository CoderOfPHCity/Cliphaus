// hooks/useVote.tsx
'use client';

import { useCallback, useState } from 'react';
import { ethers, Contract } from 'ethers';
import { useEthers } from '../components/provider/WalletProvider';
import { useContestContext } from './useContestContext';
import { CONTRACT_ABIS, DEFAULT_CONTEST_CONFIG } from '../components/constants/contracts';

export const useVote = () => {
  const { signer, address } = useEthers();
  const { currentContest } = useContestContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const vote = useCallback(async (proposalId: number, voteCount: number, contestAddress?: string) => {
    // Use provided contestAddress or fall back to current context
    const targetContest = contestAddress || currentContest;
    
    if (!targetContest) {
      throw new Error('No contest selected. Please select a contest first.');
    }

    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    if (proposalId < 0 || voteCount < 1) {
      throw new Error('Invalid proposal ID or vote count');
    }

    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      const contestContract = new Contract(
        targetContest,
        CONTRACT_ABIS.MEME_CONTEST,
        signer
      );

      const voteCost = parseFloat(DEFAULT_CONTEST_CONFIG.COST_TO_VOTE) * voteCount;
      const transaction = await contestContract.castVote(
        BigInt(proposalId),
        BigInt(voteCount),
        { value: ethers.parseEther(voteCost.toString()) }
      );
      
      setTransactionHash(transaction.hash);
      
      // Wait for confirmation
      const receipt = await transaction.wait();
      setIsLoading(false);
      return receipt;

    } catch (err: any) {
      console.error('Error casting vote:', err);
      setError(err.message || 'Failed to cast vote');
      setIsLoading(false);
      throw err;
    }
  }, [signer, address, currentContest]);

  return {
    vote,
    isLoading,
    error,
    transactionHash,
    currentContest, 
  };
};