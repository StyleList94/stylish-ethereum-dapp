import { useMemo } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

import { useAppSelector } from '@/store/hooks';

export default function usePendingTransaction() {
  const latestTxHash = useAppSelector(
    ({ transaction }) => transaction.latestTxHash,
  );

  const pendingTxHashQueue = useAppSelector(
    ({ transaction }) => transaction.pendingTxHashQueue,
  );

  const pendingTxCount = useMemo(
    () => pendingTxHashQueue.length,
    [pendingTxHashQueue],
  );

  const { data: latestTxReceipt } = useWaitForTransactionReceipt({
    hash: latestTxHash ?? undefined,
  });

  return { pendingTxCount, latestTxReceipt };
}
