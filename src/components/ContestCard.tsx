'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useContestContext } from '../hooks/useContestContext';

export interface Contest {
  id: number;
  address: string;
  title: string;
  description: string;
  creator: string;
  proposalCount: number;
  totalVotes: number;
  endTime: number;
  startTime?: number;
  status?: 'upcoming' | 'active' | 'voting' | 'completed';
}

interface ContestCardProps {
  contest: Contest;
}

export const ContestCard = ({ contest }: ContestCardProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [contestStatus, setContestStatus] = useState<'upcoming' | 'active' | 'voting' | 'completed'>('active');
  const { setCurrentContest } = useContestContext();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const endTime = contest.endTime;
      const difference = endTime - now;

      if (difference <= 0) {
        setContestStatus('completed');
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }

      // Determine status based on time
      if (contest.startTime && now < contest.startTime) {
        setContestStatus('upcoming');
      } else if (contest.startTime && now > contest.startTime && now < contest.endTime) {
        setContestStatus('active');
      } else {
        setContestStatus('completed');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [contest.endTime, contest.startTime]);

  const handleSelectContest = () => {
    setCurrentContest(contest.address);
  };

  const getStatusBadge = () => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (contestStatus) {
      case 'upcoming':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Upcoming</span>;
      case 'active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
      case 'voting':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Voting</span>;
      case 'completed':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Completed</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Active</span>;
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return `${description.slice(0, maxLength)}...`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Header with Status */}
      <div className="flex justify-between items-start p-4 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {contest.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            by {truncateAddress(contest.creator)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge()}
          <span className={`text-sm font-medium ${
            contestStatus === 'completed' ? 'text-gray-500' : 'text-orange-600'
          }`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-4">
          {truncateDescription(contest.description)}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{contest.proposalCount} proposals</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{contest.totalVotes} votes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 pb-4">
        <Link
          href={`/contests/${contest.id}`}
          onClick={handleSelectContest}
          className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors block"
        >
          {contestStatus === 'completed' ? 'View Results' : 'View Contest'}
        </Link>
      </div>

      {/* Progress Bar (optional) */}
      {contestStatus !== 'completed' && (
        <div className="px-4 pb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (contest.totalVotes / Math.max(contest.proposalCount * 10, 1)) * 100)}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};