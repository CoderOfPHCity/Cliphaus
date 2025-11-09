'use client';

import Link from 'next/link';
import { WalletConnect } from './WalletConnect';
import { ConnectionStatus } from './ConnectionStatus';

export const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">MemeContest</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/contests" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contests
              </Link>
              <Link 
                href="/create-contest" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Create Contest
              </Link>
            </div>
          </div>

          {/* Wallet and Connection Status */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ConnectionStatus />
            </div>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};