'use client';

import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import getConfig from '@/lib/config';

import StoreProvider from '@/providers/store-provider';
import ThemeProvider from '@/providers/theme-provider';

import Updater from '@/components/updater';
import Toaster from '@/components/ui/sonner';

type Props = { children: ReactNode; initialState?: State };

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};

const AppProvider = ({ children, initialState }: Props) => {
  const [config] = useState(() => getConfig());

  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <WagmiProvider config={config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Updater />
            <Toaster />
          </QueryClientProvider>
        </WagmiProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
