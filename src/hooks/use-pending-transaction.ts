import { useMemo } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

import { useAppSelector } from 'store/hooks';

export default function usePendingTransaction() {
  const { latestTxHash, pendingTxHashQueue } = useAppSelector(
    ({ transaction }) => ({
      pendingTxHash: transaction.pendingTxHash,
      latestTxHash: transaction.latestTxHash,
      pendingTxHashQueue: transaction.pendingTxHashQueue,
    }),
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
