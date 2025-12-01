"use client";

import { useState, useEffect, useRef } from "react";

interface Proposal {
  id: string;
  author: string;
  description: string;
  contentHash: string;
  votes: number;
  createdAt: number;
}

interface ProposalCardProps {
  proposal: Proposal;
  onVoteClick?: (proposal: Proposal) => void;
}

export const ProposalCard = ({ proposal, onVoteClick }: ProposalCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.1 },
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div
      ref={cardRef}
      className={`glass-strong rounded-xl border border-white/10 p-6 card-hover group ${
        isVisible ? "slide-in-up" : "opacity-0"
      }`}
      style={{
        boxShadow: "0 8px 32px 0 rgba(136, 68, 255, 0.1)",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-3 group-hover:aurora-gradient-text transition-all duration-300">
            {proposal.description}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="font-mono">
              by {truncateAddress(proposal.author)}
            </span>
            <span>•</span>
            <span>Submitted {formatTime(proposal.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-400/30 float-animation">
          <svg
            className="w-5 h-5"
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
          <span className="font-bold">{proposal.votes}</span>
        </div>
      </div>

      {/* Meme Content Placeholder */}
      <div className="glass rounded-lg p-8 text-center text-gray-400 mb-4 border border-white/10 group-hover:border-[var(--aurora-cyan)]/30 transition-all duration-300">
        <div className="flex items-center justify-center mb-3">
          <svg
            className="w-12 h-12 text-[var(--aurora-cyan)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-sm font-mono">Content: {proposal.contentHash}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onVoteClick?.(proposal)}
          className="flex-1 aurora-gradient text-white py-3 px-4 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(136,68,255,0.5)]"
        >
          Vote for this Meme
        </button>
        <button className="px-6 py-3 glass border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 text-white font-semibold">
          Share
        </button>
      </div>
    </div>
  );
};
