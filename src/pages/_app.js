import React from 'react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import AppProvider from '@/components/AppProvider';

function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          {getLayout(<Component {...pageProps} />)}
        </Hydrate>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
