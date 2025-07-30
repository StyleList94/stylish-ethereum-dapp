import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import GasTracker from './gas-tracker';

const GasTrackerLoader = async () => {
  const queryClient = new QueryClient();

  if (!!process.env.ORIGIN || process.env.NODE_ENV !== 'production') {
    const ORIGIN = process.env.ORIGIN ?? `http://localhost:${process.env.PORT}`;

    await queryClient.prefetchQuery({
      queryKey: ['gas-tracker'],
      queryFn: () =>
        fetch(`${ORIGIN}/api/gas-tracker`).then((response) => response.json()),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GasTracker />
    </HydrationBoundary>
  );
};

export default GasTrackerLoader;
