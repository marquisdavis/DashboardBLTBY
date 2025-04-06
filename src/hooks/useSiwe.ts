'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { recoverMessageAddress } from 'viem';

export function useSiweAuth() {
  const { address, isConnected } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signing, setSigning] = useState(false);
  const { signMessageAsync } = useSignMessage();

  const signIn = async () => {
    const message = `Sign in to Built By DAO.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
    try {
      setSigning(true);
      const signature = await signMessageAsync({ message });
      const recovered = await recoverMessageAddress({ message, signature });

      if (recovered.toLowerCase() === address?.toLowerCase()) {
        setIsAuthenticated(true);
      } else {
        console.error('Signature mismatch');
      }
    } catch (err) {
      console.error('Signature failed', err);
    } finally {
      setSigning(false);
    }
  };

  // 🔁 Automatically trigger sign-in when wallet connects
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !signing) {
      signIn();
    }
  }, [isConnected, address]);

  return { isAuthenticated, signing, address };
}
