// src/app/contests/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CreateProposalForm } from '../../../components/CreateProposalForm';
import { VotingInterface } from '../../../components/VotingInterface';
import { ProposalCard } from '../../../components/ProposalCard';
import { useContestContext } from '../../../hooks/useContestContext';

// Mock data - replace with actual contract calls
const mockContest = {
  id: 1,
  address: '0x2dEb56795F4b86e1EfF814Fd7c2b60f4beE2612A',
  title: 'Best Crypto Meme 2024',
  description: 'Submit your funniest crypto memes! The community will vote for the most hilarious and creative entries. Winners get ETH rewards and bragging rights!',
  creator: '0xabcdef1234567890abcdef1234567890abcdef12',
  proposalCount: 15,
  totalVotes: 245,
  endTime: Date.now() + 86400000, // 1 day from now
  startTime: Date.now() - 86400000, // Started 1 day ago
  status: 'active' as const,
};

const mockProposals = [
  {
    id: 1,
    author: '0x123...abc',
    description: 'When you see the gas fees...',
    contentHash: 'QmTest1',
    votes: 45,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 2,
    author: '0x456...def',
    description: 'Trying to explain Bitcoin to family',
    contentHash: 'QmTest2',
    votes: 32,
    createdAt: Date.now() - 43200000,
  },
];

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params.id;
  const [activeTab, setActiveTab] = useState<'proposals' | 'submit' | 'vote'>('proposals');

  const { setCurrentContest } = useContestContext();

  useEffect(() => {
    // Set the current contest when page loads
    setCurrentContest(mockContest.address);
  }, [setCurrentContest]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/contests"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Contests
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockContest.title}</h1>
                <p className="text-gray-600">{mockContest.description}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Creator:</span> {mockContest.creator}
              </div>
              <div>
                <span className="font-medium">Proposals:</span> {mockContest.proposalCount}
              </div>
              <div>
                <span className="font-medium">Total Votes:</span> {mockContest.totalVotes}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'proposals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            View Proposals
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'submit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Submit Proposal
          </button>
          <button
            onClick={() => setActiveTab('vote')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'vote'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Vote
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {mockProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        )}

{activeTab === 'submit' && (
  <CreateProposalForm />
)}

        {activeTab === 'vote' && (
          <VotingInterface contestAddress={mockContest.address} proposals={mockProposals} />
        )}
      </div>
    </div>
  );
}