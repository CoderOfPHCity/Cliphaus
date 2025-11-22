"use client";

import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export const WalletConnect = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      {isConnected && address ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 glass border border-green-400/30 rounded-full px-4 py-2 backdrop-blur-md">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-mono font-semibold">
              {truncateAddress(address)}
            </span>
          </div>
          <button
            onClick={() => open()}
            className="glass hover:bg-red-500/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border border-white/20 hover:border-red-400/50"
          >
            Account
          </button>
        </div>
      ) : (
        <button
          onClick={() => open()}
          className="aurora-gradient text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
        >
          Connect Wallet
        </button>
      )}
    </>
  );
};
