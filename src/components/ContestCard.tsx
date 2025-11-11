"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useContestContext } from "../hooks/useContestContext";

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
  status?: "upcoming" | "active" | "voting" | "completed";
}

interface ContestCardProps {
  contest: Contest;
}

export const ContestCard = ({ contest }: ContestCardProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [contestStatus, setContestStatus] = useState<
    "upcoming" | "active" | "voting" | "completed"
  >("active");
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { setCurrentContest } = useContestContext();

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const endTime = contest.endTime;
      const difference = endTime - now;

      if (difference <= 0) {
        setContestStatus("completed");
        setTimeLeft("Ended");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
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
        setContestStatus("upcoming");
      } else if (
        contest.startTime &&
        now > contest.startTime &&
        now < contest.endTime
      ) {
        setContestStatus("active");
      } else {
        setContestStatus("completed");
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
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm";

    switch (contestStatus) {
      case "upcoming":
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-300 border border-blue-400/30`}>
            Upcoming
          </span>
        );
      case "active":
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-300 border border-green-400/30 aurora-glow`}>
            Active
          </span>
        );
      case "voting":
        return (
          <span className={`${baseClasses} bg-purple-500/20 text-purple-300 border border-purple-400/30`}>
            Voting
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-gray-500/20 text-gray-300 border border-gray-400/30`}>
            Completed
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-500/20 text-gray-300 border border-gray-400/30`}>
            Active
          </span>
        );
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 100,
  ) => {
    if (description.length <= maxLength) return description;
    return `${description.slice(0, maxLength)}...`;
  };

  return (
    <div 
      ref={cardRef}
      className={`glass-strong rounded-xl overflow-hidden border border-white/10 card-hover group ${
        isVisible ? 'slide-in-up' : 'opacity-0'
      }`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 255, 136, 0.1)',
      }}
    >
      {/* Header with Status */}
      <div className="flex justify-between items-start p-5 border-b border-white/10">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:aurora-gradient-text transition-all duration-300">
            {contest.title}
          </h3>
          <p className="text-sm text-gray-400 mb-2 font-mono">
            by {truncateAddress(contest.creator)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge()}
          <span
            className={`text-sm font-semibold ${
              contestStatus === "completed"
                ? "text-gray-400"
                : "text-[var(--aurora-cyan)]"
            }`}
          >
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="p-5">
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {truncateDescription(contest.description)}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group/stat">
              <svg
                className="w-5 h-5 text-[var(--aurora-purple)] group-hover/stat:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium">{contest.proposalCount} proposals</span>
            </div>
            <div className="flex items-center gap-2 group/stat">
              <svg
                className="w-5 h-5 text-[var(--aurora-cyan)] group-hover/stat:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span className="font-medium">{contest.totalVotes} votes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5">
        <Link
          href={`/contests/${contest.id}`}
          onClick={handleSelectContest}
          className="w-full aurora-gradient text-white text-center py-3 px-4 rounded-lg font-semibold block transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
        >
          {contestStatus === "completed" ? "View Results" : "View Contest"}
        </Link>
      </div>

      {/* Progress Bar */}
      {contestStatus !== "completed" && (
        <div className="px-5 pb-5">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="aurora-gradient h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (contest.totalVotes / Math.max(contest.proposalCount * 10, 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
