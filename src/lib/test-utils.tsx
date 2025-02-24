import { type ReactElement, type ReactNode, useState } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';

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
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
