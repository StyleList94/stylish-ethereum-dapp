import { type ReactElement, type ReactNode, useState } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

import { createRootStore } from '@/store';
import { StoreContext } from '@/providers/store-provider';

vi.mock('zustand');

const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    mock({
      accounts: [
        '0x29072219f93D6893F9201Adfc31246169e785252',
        '0xa2c5189F10181B90b51A4CE509865100d64A0be0',
      ],
    }),
  ],

  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const AllTheProviders = ({ children }: { children: ReactNode }) => {
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
    <StoreContext.Provider value={createRootStore()}>
      <WagmiProvider config={config} reconnectOnMount={false}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </StoreContext.Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

const renderWithStore = (
  ui: ReactElement,
  store: ReturnType<typeof createRootStore>,
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    ),
  });

export * from '@testing-library/react';
export { customRender as render, renderWithStore };
