"use client";

import { useEthers } from "./provider/WalletProvider";
import { useEffect, useState } from "react";

export const ConnectionStatus = () => {
  const { isConnected, isLoading, provider } = useEthers();
  const [networkName, setNetworkName] = useState<string>("");

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!provider || !isConnected) {
        setNetworkName("");
        return;
      }

      try {
        const network = await provider.getNetwork();
        switch (network.chainId) {
          case BigInt(1):
            setNetworkName("Ethereum Mainnet");
            break;
          case BigInt(84532):
            setNetworkName("Base-Sepolia");
            break;
          case BigInt(5):
            setNetworkName("Goerli");
            break;
          case BigInt(137):
            setNetworkName("Polygon");
            break;
          case BigInt(80001):
            setNetworkName("Mumbai");
            break;
          case BigInt(1337):
            setNetworkName("Localhost");
            break;
          default:
            setNetworkName(`Chain ${network.chainId}`);
        }
      } catch (error) {
        console.error("Error getting network:", error);
        setNetworkName("Unknown Network");
      }
    };

    fetchNetwork();
  }, [provider, isConnected]);

  const getStatusColor = () => {
    if (isLoading) return "bg-yellow-400 animate-pulse";
    if (isConnected) return "bg-green-400 animate-pulse";
    return "bg-red-400";
  };

  const getStatusText = () => {
    if (isLoading) return "Connecting...";
    if (isConnected) return "Connected";
    return "Disconnected";
  };

  return (
    <div className="flex items-center gap-3 text-sm glass px-4 py-2 rounded-full border border-white/20">
      <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()}`} />
      <span className="text-white font-semibold">{getStatusText()}</span>
      {isConnected && networkName && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-[var(--aurora-cyan)] font-mono text-xs">
            {networkName}
          </span>
        </>
      )}
    </div>
  );
};
