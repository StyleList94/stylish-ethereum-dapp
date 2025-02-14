import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

import useRootStore from '@/store/hooks';

const Updater = () => {
  const { pendingTxHash, removeAddressToPendingTxHash, findPendingTxHash } =
    useRootStore((store) => store);

  const { address } = useAccount();

  const { status: waitTxStatus } = useWaitForTransactionReceipt({
    hash: pendingTxHash ?? undefined,
  });

  useEffect(() => {
    if (
      pendingTxHash &&
      address &&
      (waitTxStatus === 'success' || waitTxStatus === 'error')
    ) {
      removeAddressToPendingTxHash({ address });
    }
  }, [removeAddressToPendingTxHash, waitTxStatus, pendingTxHash, address]);

  useEffect(() => {
    if (address) {
      findPendingTxHash({ address });
    }
  }, [findPendingTxHash, address]);

  return <div className="updater" />;
};

export default Updater;
