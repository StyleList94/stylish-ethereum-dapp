import { useMemo } from 'react';
import {
  useAccount,
  useTransactionReceipt,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { toast } from 'sonner';

import useRootStore from '@/store/hooks';

export default function usePendingTransaction() {
  const { address, chainId } = useAccount();

  const {
    pendingTxHash,
    pendingTxHashQueue,
    latestTxHash,
    setAddressToPendingTxHash,
  } = useRootStore((state) => state);

  const pendingTxCount = useMemo(
    () => pendingTxHashQueue.length,
    [pendingTxHashQueue],
  );

  const { status, error } = useWaitForTransactionReceipt({
    hash: pendingTxHash ?? undefined,
    onReplaced: (replacement) => {
      const { replacedTransaction, transaction } = replacement;
      toast.dismiss(transaction.hash);
      if (address && chainId) {
        setAddressToPendingTxHash({
          address,
          chainId,
          txHash: replacedTransaction.hash,
        });
      }
    },
  });

  const { data: latestTxReceipt, status: latestTxStatus } =
    useTransactionReceipt({
      hash: latestTxHash ?? undefined,
    });

  return {
    pendingTxCount,
    pendingTxHash,
    latestTxReceipt,
    status,
    latestTxStatus,
    error,
  };
}
