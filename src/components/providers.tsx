'use client';

import { type ReactNode, useRef, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import { makeStore, AppStore } from '@/store';

import ThemeProvider from '@/components/theme-provider';
import Updater from '@/components/updater';
import RouteProgress from '@/components/route-progress';

import 'react-toastify/dist/ReactToastify.css';

const config = createConfig({
  chains: [mainnet, sepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [injected({ target: 'metaMask' })],
});

const Providers = ({ children }: { children: ReactNode }) => {
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

  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={storeRef.current}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
              <RouteProgress />
              {children}
              <ToastContainer />
              <Updater />
            </ReactQueryStreamedHydration>
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default Providers;
