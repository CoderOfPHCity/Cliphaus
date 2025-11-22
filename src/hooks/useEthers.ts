import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useEffect, useState } from "react";
import type { Provider } from "@reown/appkit/react";

export function useEthers() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (!walletProvider || !isConnected || !address) {
      setSigner(null);
      setProvider(null);
      return;
    }

    const initializeProvider = async () => {
      try {
        const ethersProvider = new BrowserProvider(walletProvider as any);
        setProvider(ethersProvider);
        
        // Get the signer without passing the address
        const signer = await ethersProvider.getSigner();
        
        if (signer) {
          setSigner(signer as JsonRpcSigner);
        }
      } catch (err) {
        console.error("Failed to initialize signer:", err);
        setSigner(null);
        setProvider(null);
      }
    };

    initializeProvider();
  }, [walletProvider, isConnected, address]);

  return {
    provider,
    signer,
    address: address || null,
    isConnected,
    isLoading: false,
    error: null,
  };
}
