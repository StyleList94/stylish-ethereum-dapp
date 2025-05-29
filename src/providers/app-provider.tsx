'use client';

import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import getConfig from '@/lib/config';

import StoreProvider from '@/providers/store-provider';
import ThemeProvider from '@/providers/theme-provider';
import Updater from '@/components/updater';
import Toaster from '@/components/ui/sonner';

type Props = { children: ReactNode; initialState?: State };

const AppProvider = ({ children, initialState }: Props) => {
  const [config] = useState(() => getConfig());
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
        <WagmiProvider config={config} initialState={initialState}>
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
