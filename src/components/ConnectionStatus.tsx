'use client';

import { useEthers } from './provider/WalletProvider';
import { useEffect, useState } from 'react';

export const ConnectionStatus = () => {
  const { isConnected, isLoading, provider } = useEthers();
  const [networkName, setNetworkName] = useState<string>('');

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!provider || !isConnected) {
        setNetworkName('');
        return;
      }

      try {
        const network = await provider.getNetwork();
        switch (network.chainId) {
          case BigInt(1): setNetworkName('Ethereum Mainnet'); break;
          case BigInt(84532): setNetworkName('Base-Sepolia'); break;
          case BigInt(5): setNetworkName('Goerli'); break;
          case BigInt(137): setNetworkName('Polygon'); break;
          case BigInt(80001): setNetworkName('Mumbai'); break;
          case BigInt(1337): setNetworkName('Localhost'); break;
          default: setNetworkName(`Chain ${network.chainId}`);
        }
      } catch (error) {
        console.error('Error getting network:', error);
        setNetworkName('Unknown Network');
      }
    };

    fetchNetwork();
  }, [provider, isConnected]);

  const getStatusColor = () => {
    if (isLoading) return 'bg-yellow-500';
    if (isConnected) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (isLoading) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-gray-600">{getStatusText()}</span>
      {isConnected && networkName && (
        <span className="text-gray-500">• {networkName}</span>
      )}
    </div>
  );
};