import React from 'react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import type { AppProps } from 'next/app';
import type { DehydratedState } from '@tanstack/react-query';
import type { NextPageWithLayout } from 'types/next-page';

import AppProvider from '@/components/AppProvider';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const { dehydratedState } = pageProps as { dehydratedState: DehydratedState };
  const [queryClient] = React.useState(() => new QueryClient());

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          {getLayout(<Component {...pageProps} />)}
        </Hydrate>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
