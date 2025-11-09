'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContestCard, Contest } from '../../components/ContestCard';

// Mock data - replace with actual contract calls
const mockContests: Contest[] = [
  {
    id: 1,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    title: 'Best Crypto Meme 2024',
    description: 'Submit your funniest crypto memes! The community will vote for the most hilarious and creative entries. Winners get ETH rewards and bragging rights!',
    creator: '0xabcdef1234567890abcdef1234567890abcdef12',
    proposalCount: 15,
    totalVotes: 245,
    endTime: Date.now() + 86400000, // 1 day from now
    startTime: Date.now() - 86400000, // Started 1 day ago
  },
  {
    id: 2,
    address: '0x234567890abcdef1234567890abcdef123456789',
    title: 'NFT Artist Showdown',
    description: 'Digital artists, showcase your best NFT-inspired memes. Let\'s see who can create the most viral NFT content!',
    creator: '0xbcdef1234567890abcdef1234567890abcdef123',
    proposalCount: 8,
    totalVotes: 120,
    endTime: Date.now() + 172800000, // 2 days from now
    startTime: Date.now() - 3600000, // Started 1 hour ago
  },
  {
    id: 3,
    address: '0x34567890abcdef1234567890abcdef1234567890',
    title: 'DeFi Degens Unite',
    description: 'Create memes about your DeFi experiences - liquidity pools, yield farming, and everything in between!',
    creator: '0xcdef1234567890abcdef1234567890abcdef1234',
    proposalCount: 22,
    totalVotes: 367,
    endTime: Date.now() - 3600000, // Ended 1 hour ago
    startTime: Date.now() - 604800000, // Started 7 days ago
  },
];

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>(mockContests);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredContests = contests.filter(contest => {
    if (filter === 'all') return true;
    if (filter === 'active') {
      return contest.endTime > Date.now();
    }
    return contest.endTime <= Date.now();
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meme Contests</h1>
          <p className="text-gray-600 mt-2">Discover and participate in community meme contests</p>
        </div>
        <Link
          href="/create-contest"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create New Contest
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Contests
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            filter === 'active'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            filter === 'completed'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>

      {filteredContests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-4">No contests found</p>
          <Link
            href="/create-contest"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Contest
          </Link>
        </div>
      )}
    </div>
  );
}