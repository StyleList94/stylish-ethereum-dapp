'use client';

import { type ReactNode, useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

import StoreProvider from '@/providers/store-provider';
import ThemeProvider from '@/providers/theme-provider';
import Updater from '@/components/updater';
import Toaster from '@/components/ui/sonner';

const config = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        : undefined,
    ),
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
        ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        : undefined,
    ),
  },
  connectors: [injected({ target: 'metaMask' })],
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
              {children}
              <Updater />
              <Toaster />
            </ReactQueryStreamedHydration>
          </QueryClientProvider>
        </WagmiProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
