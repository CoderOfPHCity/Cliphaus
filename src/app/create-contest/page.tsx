"use client";

import { CreateContestForm } from "../../components/CreateContestForm";
import Link from "next/link";

export default function CreateContestPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 slide-in-up">
          <Link
            href="/contests"
            className="inline-flex items-center text-[var(--aurora-cyan)] hover:text-[var(--aurora-green)] mb-6 transition-colors group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Contests
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">
            Create New <span className="aurora-gradient-text">Contest</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Set up a new meme contest and let the community vote for the best content
          </p>
        </div>

        {/* Create Contest Form */}
        <div className="slide-in-up" style={{ animationDelay: '0.1s' }}>
          <CreateContestForm />
        </div>

        {/* Additional Info */}
        <div className="mt-12 glass-strong rounded-xl p-8 max-w-3xl mx-auto border border-[var(--aurora-cyan)]/30 slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 aurora-gradient rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">
              How it works
            </h3>
          </div>
          <ul className="text-gray-300 space-y-4 text-base">
            <li className="flex items-start gap-3">
              <span className="text-[var(--aurora-cyan)] font-bold">01.</span>
              <span>Set contest parameters like voting period and submission limits</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--aurora-green)] font-bold">02.</span>
              <span>Configure costs for submitting proposals and voting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--aurora-purple)] font-bold">03.</span>
              <span>Choose how rewards are distributed to creators</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--aurora-cyan)] font-bold">04.</span>
              <span>Deploy your contest to the blockchain</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--aurora-green)] font-bold">05.</span>
              <span>Share the contest link to start receiving submissions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
