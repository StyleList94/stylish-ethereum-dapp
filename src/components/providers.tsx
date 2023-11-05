'use client';

import React, { useState } from 'react';
import { configureChains, WagmiConfig, createConfig } from 'wagmi';
import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import { store } from 'store';

import RouteProgress from '@/components/route-progress';

import 'react-toastify/dist/ReactToastify.css';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet],
  [publicProvider()],
);

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
  ],
});

const Providers = ({ children }: { children: React.ReactNode }) => {
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
          <WagmiConfig config={config}>
            <RouteProgress />
            {children}
            <ToastContainer />
          </WagmiConfig>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
