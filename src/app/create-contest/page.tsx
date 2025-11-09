'use client';

import { CreateContestForm } from '../../components/CreateContestForm';
import Link from 'next/link';

export default function CreateContestPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Contest</h1>
          <p className="text-gray-600 mt-2">
            Set up a new meme contest and let the community vote for the best content
          </p>
        </div>

        {/* Create Contest Form */}
        <CreateContestForm />

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works</h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Set contest parameters like voting period and submission limits</li>
            <li>• Configure costs for submitting proposals and voting</li>
            <li>• Choose how rewards are distributed to creators</li>
            <li>• Deploy your contest to the blockchain</li>
            <li>• Share the contest link to start receiving submissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}