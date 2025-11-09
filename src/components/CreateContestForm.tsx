'use client';

import { useState, useEffect } from 'react';
import { useMemeContestFactory } from '../hooks/useMemeContestFactory';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';

export const CreateContestForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [votingPeriod, setVotingPeriod] = useState(7); // days
  const [costToPropose, setCostToPropose] = useState('0.01');
  const [costToVote, setCostToVote] = useState('0.001');
  const [maxProposals, setMaxProposals] = useState(100);
  
  const router = useRouter();

  // Add transactionHash to the hook destructuring
const { createContest, isLoading, error, transactionHash } = useMemeContestFactory();

// Add useEffect for successful transaction
useEffect(() => {
  if (transactionHash) {
    setTimeout(() => {
      router.push('/contests');
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Contest Configuration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Best Crypto Meme 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your contest theme, rules, and any special requirements..."
                required
              />
            </div>
          </div>

          {/* Contest Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting Period (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={votingPeriod}
                onChange={(e) => setVotingPeriod(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Proposals
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={maxProposals}
                onChange={(e) => setMaxProposals(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost to Propose (ETH)
              </label>
              <input
                type="text"
                value={costToPropose}
                onChange={(e) => setCostToPropose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost to Vote (ETH)
              </label>
              <input
                type="text"
                value={costToVote}
                onChange={(e) => setCostToVote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.001"
              />
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Cost Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Proposal submission: {costToPropose} ETH</p>
              <p>• Per vote: {costToVote} ETH</p>
              <p>• Voting period: {votingPeriod} days</p>
              <p>• Maximum proposals: {maxProposals}</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
           // Update button disabled state and text
disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
     
           {isLoading ? 'Creating Contest...' : transactionHash ? 'Contest Created!' : 'Create Contest'}
          </button>

          {/* Status Messages */}
    
{transactionHash && (
  <div className="p-4 bg-green-100 text-green-700 rounded-md">
    <p className="font-medium">Contest created successfully!</p>
    <p className="text-sm">Redirecting to contests page...</p>
  </div>
)}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              <p className="font-medium">Error creating contest</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};