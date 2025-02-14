import { useMemo } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import useRootStore from '@/store/hooks';

export default function usePendingTransaction() {
  const { latestTxHash, pendingTxHashQueue } = useRootStore((state) => state);

  const pendingTxCount = useMemo(
    () => pendingTxHashQueue.length,
    [pendingTxHashQueue],
  );

  const { data: latestTxReceipt } = useWaitForTransactionReceipt({
    hash: latestTxHash ?? undefined,
  });

  return { pendingTxCount, latestTxReceipt };
}
