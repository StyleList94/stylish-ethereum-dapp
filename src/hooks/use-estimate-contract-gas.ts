import type { EstimateContractGasParameters } from 'viem';

import { useCallback } from 'react';
import { useAccount, usePublicClient } from 'wagmi';

export default function useEstimateContractGas() {
  const { address } = useAccount();
  const client = usePublicClient();

  return useCallback(
    async (args: EstimateContractGasParameters): Promise<bigint> => {
      if (!address) {
        throw new Error(' must be connected wallet to estimate gas.');
      }

      if (!client) {
        throw new Error('PublicClient is not initialized');
      }

      return await client.estimateContractGas({ ...args, account: address });
    },
    [address, client],
  );
}
