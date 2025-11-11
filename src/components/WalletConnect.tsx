"use client";

import { useEthers } from "./provider/WalletProvider";

export const WalletConnect = () => {
  const { address, isConnected, connectWallet, disconnectWallet, isLoading } =
    useEthers();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 glass border border-green-400/30 rounded-full px-4 py-2 backdrop-blur-md">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-mono font-semibold">
            {truncateAddress(address)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="glass hover:bg-red-500/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border border-white/20 hover:border-red-400/50"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className="aurora-gradient text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]"
    >
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};
