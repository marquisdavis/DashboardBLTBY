'use client';

import { ReactNode } from 'react';
import { TokenDataProvider } from '@/hooks/useTokenData';
import { NFTDataProvider } from '@/hooks/useNFTData';
import { GovernanceDataProvider } from '@/hooks/useGovernanceData';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TokenDataProvider>
      <NFTDataProvider>
        <GovernanceDataProvider>
          {children}
        </GovernanceDataProvider>
      </NFTDataProvider>
    </TokenDataProvider>
  );
}
