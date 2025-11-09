// components/CreateProposalForm.tsx
'use client';

import { useState } from 'react';
import { useCreateProposal } from '../hooks/useCreateProposal';
import { DEFAULT_CONTEST_CONFIG } from './constants/contracts';

export const CreateProposalForm = () => {
  const [proposalDescription, setProposalDescription] = useState('');
  const [contentHash, setContentHash] = useState('');
  
  const { createProposal, isLoading, error, transactionHash, currentContest } = useCreateProposal();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async () => {
    if (!proposalDescription || !contentHash) return;

    try {
      await createProposal(proposalDescription, contentHash);
      setIsConfirmed(true);
      // Clear form on success
      setProposalDescription('');
      setContentHash('');
    } catch (err) {
      // Error handled by hook
    }
  };

  if (!currentContest) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">
          Please select a contest first to submit a proposal.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Submit Meme Proposal</h3>
      <p className="text-sm text-gray-600 mb-4">
        Submitting to: {currentContest.slice(0, 8)}...{currentContest.slice(-6)}
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meme Description
          </label>
          <input
            type="text"
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your meme..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Hash (IPFS)
          </label>
          <input
            type="text"
            value={contentHash}
            onChange={(e) => setContentHash(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Qm..."
          />
        </div>

        <div className="text-sm text-gray-600">
          <p>Cost to propose: {DEFAULT_CONTEST_CONFIG.COST_TO_PROPOSE} ETH</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || isConfirmed}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting...' : isConfirmed ? 'Confirmed!' : 'Submit Proposal'}
        </button>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isConfirmed && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            Proposal submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
};