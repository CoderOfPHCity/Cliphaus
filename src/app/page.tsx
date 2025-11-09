import Link from 'next/link';
//import { CryptoCard } from '../components/CryptoCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meme Contest Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create contests, submit memes, and vote for the best content
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              href="/create-contest"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Contest
            </Link>
            <Link
              href="/contests"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Contests
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}