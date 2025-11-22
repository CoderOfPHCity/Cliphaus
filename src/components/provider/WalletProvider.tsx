"use client";

import { ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, base, baseSepolia, sepolia } from "@reown/appkit/networks";

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

// 2. Set up metadata
const metadata = {
  name: "ClipHaus",
  description: "ClipHaus Meme Contest Platform",
  url: typeof window !== "undefined" ? window.location.origin : "https://cliphaus.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 3. Create Ethers adapter
const ethersAdapter = new EthersAdapter();

// 4. Create modal
createAppKit({
  adapters: [ethersAdapter],
  networks: [mainnet, base, baseSepolia, sepolia],
  metadata,
  projectId,
  features: {
    analytics: false,
  },
});

export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
