'use client';

import { useEthers } from './provider/WalletProvider';

export const WalletConnect = () => {
  const { 
    address, 
    isConnected, 
    connectWallet, 
    disconnectWallet, 
    isLoading 
  } = useEthers();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-green-700 text-sm font-medium">
            {truncateAddress(address)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
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
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};