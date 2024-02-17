import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

import {
  findPendingTxHash,
  removeAddressToPendingTxHash,
} from 'store/transaction';
import { useAppDispatch, useAppSelector } from 'store/hooks';

const Updater = () => {
  const dispatch = useAppDispatch();

  const { address } = useAccount();

  const { pendingTxHash } = useAppSelector(({ transaction }) => ({
    pendingTxHash: transaction.pendingTxHash,
    latestTxHash: transaction.latestTxHash,
    pendingTxHashQueue: transaction.pendingTxHashQueue,
  }));

  const { status: waitTxStatus } = useWaitForTransactionReceipt({
    hash: pendingTxHash ?? undefined,
  });

  useEffect(() => {
    if (
      pendingTxHash &&
      address &&
      (waitTxStatus === 'success' || waitTxStatus === 'error')
    ) {
      dispatch(removeAddressToPendingTxHash({ address }));
    }
  }, [dispatch, waitTxStatus, pendingTxHash, address]);

  useEffect(() => {
    if (address) {
      dispatch(findPendingTxHash({ address }));
    }
  }, [dispatch, address]);

  return <div className="updater" />;
};

export default Updater;
