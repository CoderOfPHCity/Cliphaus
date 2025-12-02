"use client";

import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useEthers } from "./provider/WalletProvider";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("walletConnect"),
];

export const WalletConnect = () => {
  const { address, isConnected, disconnectWallet, isLoading } = useEthers();

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
        <ConnectButton
          client={client}
          wallets={wallets}
          connectButton={{
            label: truncateAddress(address),
          }}
        />
      </div>
    );
  }

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectButton={{
        className:
          "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors",
        label: "Connect Wallet",
      }}
    />
  );
};
