'use client';

import { type ReactNode, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import StoreProvider from '@/providers/store-provider';
import ThemeProvider from '@/providers/theme-provider';
import Updater from '@/providers/updater';

const config = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(
      'https://eth-sepolia.g.alchemy.com/v2/SKuyohYT5v9BKTjRMPWzaOdlEtt03clh',
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
            </ReactQueryStreamedHydration>
          </QueryClientProvider>
        </WagmiProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
