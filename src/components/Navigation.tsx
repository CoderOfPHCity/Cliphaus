"use client";

import Link from "next/link";
import { WalletConnect } from "./WalletConnect";
import { ConnectionStatus } from "./ConnectionStatus";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 aurora-gradient rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-white text-xl aurora-gradient-text-static">
                ClipHaus
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/contests"
                className="text-gray-300 hover:text-white transition-colors font-medium relative group"
              >
                Contests
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--aurora-cyan)] to-[var(--aurora-green)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/create-contest"
                className="text-gray-300 hover:text-white transition-colors font-medium relative group"
              >
                Create Contest
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--aurora-cyan)] to-[var(--aurora-green)] group-hover:w-full transition-all duration-300"></span>
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
