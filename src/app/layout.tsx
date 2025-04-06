'use client';

import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { AppProviders } from '@/components/app-providers';

const config = getDefaultConfig({
  appName: 'Built By DAO Dashboard',
  projectId: '5f82e8377e38f2a9469593cef67e6689',
  chains: [mainnet],
  ssr: false,
});

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <AppProviders>{children}</AppProviders>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
