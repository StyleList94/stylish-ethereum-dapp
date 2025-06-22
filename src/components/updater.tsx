import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

import usePendingTransaction from '@/hooks/use-pending-transaction';
import useRootStore from '@/store/hooks';

const Updater = () => {
  const {
    pendingTxHash,
    latestTxHash,
    removeAddressToPendingTxHash,
    findPendingTxHash,
  } = useRootStore((store) => store);

  const { address, chainId, chain } = useAccount();

  const { status: waitTxStatus, latestTxStatus } = usePendingTransaction();

  useEffect(() => {
    if (pendingTxHash && waitTxStatus === 'pending') {
      toast.loading('Pending Transaction...', { id: pendingTxHash });
    }
  }, [pendingTxHash, waitTxStatus]);

  useEffect(() => {
    if (latestTxHash && latestTxStatus !== 'pending') {
      toast[latestTxStatus](
        `${latestTxStatus === 'success' ? 'Complete' : 'Fail'} Transaction!`,
        {
          id: latestTxHash,
          action: chain?.blockExplorers?.default.url && {
            label: 'View explorer',
            onClick: () => {
              window.open(chain.blockExplorers?.default.url, '_blank');
            },
          },
        },
      );
    }
  }, [latestTxHash, latestTxStatus, chain]);

  useEffect(() => {
    if (
      pendingTxHash &&
      address &&
      chainId &&
      (waitTxStatus === 'success' || waitTxStatus === 'error')
    ) {
      removeAddressToPendingTxHash({ address, chainId });
    }
  }, [
    removeAddressToPendingTxHash,
    waitTxStatus,
    pendingTxHash,
    address,
    chainId,
  ]);

  useEffect(() => {
    if (address && chainId) {
      findPendingTxHash({ address, chainId });
    }
  }, [findPendingTxHash, address, chainId]);

  return <div className="updater" />;
};

export default Updater;
