'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, ethers } from 'ethers';

interface EthersContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  error: string | null;
}

const EthersContext = createContext<EthersContextType | undefined>(undefined);


// Add this interface before your component
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
export function WalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await initializeProvider();
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const initializeProvider = async () => {
    if (!window.ethereum) {
      setError('No Ethereum wallet found. Please install MetaMask.');
      return;
    }

    try {
      const ethersProvider = new BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();
      const userAddress = await ethersSigner.getAddress();

      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setAddress(userAddress);
      setError(null);
    } catch (err) {
      console.error('Error initializing provider:', err);
      setError('Failed to initialize wallet connection.');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No Ethereum wallet found. Please install MetaMask.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await initializeProvider();
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user.');
      } else {
        setError('Failed to connect wallet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setError(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAddress(accounts[0]);
        initializeProvider();
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const value: EthersContextType = {
    provider,
    signer,
    address,
    isConnected: !!address,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
  };

  return (
    <EthersContext.Provider value={value}>
      {children}
    </EthersContext.Provider>
  );
}

export function useEthers() {
  const context = useContext(EthersContext);
  if (context === undefined) {
    throw new Error('useEthers must be used within an EthersProvider');
  }
  return context;
}
