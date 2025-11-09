import { useCallback, useState } from 'react';
import { ethers, Contract } from 'ethers';
import { useEthers } from '../components/provider/WalletProvider';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, DEFAULT_CONTEST_CONFIG } from '../components/constants/contracts';

export interface ContestConfig {
  contestStart: number;
  votingDelay: number;
  votingPeriod: number;
  numAllowedProposalSubmissions: number;
  maxProposalCount: number;
  percentageToCreator: number;
  costToPropose: bigint;
  costToVote: bigint;
  priceCurveType: number;
  multiple: bigint;
  creatorSplitDestination: string;
}

export const useMemeContestFactory = () => {
  const { signer, address } = useEthers();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const createContest = useCallback(async (config: Partial<ContestConfig>) => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    

    setIsLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      const fullConfig: ContestConfig = {
        contestStart: Math.floor(Date.now() / 1000) + DEFAULT_CONTEST_CONFIG.CONTEST_START_DELAY,
        votingDelay: DEFAULT_CONTEST_CONFIG.VOTING_DELAY,
        votingPeriod: DEFAULT_CONTEST_CONFIG.VOTING_PERIOD,
        numAllowedProposalSubmissions: DEFAULT_CONTEST_CONFIG.NUM_ALLOWED_SUBMISSIONS,
        maxProposalCount: DEFAULT_CONTEST_CONFIG.MAX_PROPOSAL_COUNT,
        percentageToCreator: DEFAULT_CONTEST_CONFIG.PERCENTAGE_TO_CREATOR,
        costToPropose: ethers.parseEther(DEFAULT_CONTEST_CONFIG.COST_TO_PROPOSE),
costToVote: ethers.parseEther(DEFAULT_CONTEST_CONFIG.COST_TO_VOTE),
priceCurveType: DEFAULT_CONTEST_CONFIG.PRICE_CURVE_EXPONENTIAL, 
multiple: ethers.parseEther(DEFAULT_CONTEST_CONFIG.EXPONENTIAL_MULTIPLE),
   creatorSplitDestination: address,
        ...config,
      };

      // Convert to tuple format expected by ethers
      const contestConfig = [
        fullConfig.contestStart,
        fullConfig.votingDelay,
        fullConfig.votingPeriod,
        fullConfig.numAllowedProposalSubmissions,
        fullConfig.maxProposalCount,
        fullConfig.percentageToCreator,
        fullConfig.costToPropose,
        fullConfig.costToVote,
        fullConfig.priceCurveType,
        fullConfig.multiple,
        fullConfig.creatorSplitDestination,
      ];

      const salt = ethers.keccak256(
        ethers.solidityPacked(
          ['address', 'uint256'],
          [address, Math.floor(Date.now() / 1000)]
        )
      );

      

      // Create contract instance
      const factoryContract = new Contract(
        CONTRACT_ADDRESSES.MEME_CONTEST_FACTORY,
        CONTRACT_ABIS.MEME_CONTEST_FACTORY,
        signer
      );


      // Send transaction
    const transaction = await factoryContract.createContest(contestConfig, salt);
      setTransactionHash(transaction.hash);

      // Wait for confirmation
      const receipt = await transaction.wait();
      
      setIsLoading(false);
      return receipt;

    } catch (err: any) {
      console.error('Error creating contest:', err);
      setError(err.message || 'Failed to create contest');
      setIsLoading(false);
      throw err;
    }
  }, [signer, address]);

  return {
    createContest,
    isLoading,
    error,
    transactionHash,
  };
};