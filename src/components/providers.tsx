'use client';

import { type ReactNode, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import { store } from 'store';

import RouteProgress from '@/components/route-progress';

import 'react-toastify/dist/ReactToastify.css';
import Updater from '@/components/updater';

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

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <WagmiProvider config={config}>
            <RouteProgress />
            {children}
            <ToastContainer />
            <Updater />
          </WagmiProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
