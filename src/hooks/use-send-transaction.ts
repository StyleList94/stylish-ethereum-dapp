import {
  useAccount,
  useSendTransaction as useWagmiSendTransaction,
  type UseSendTransactionParameters,
} from 'wagmi';

import { useAppDispatch } from '@/store/hooks';
import { setAddressToPendingTxHash } from '@/store/transaction';
import type { Config, ResolvedRegister } from '@wagmi/core';

export default function useSendTransaction<
  InternalConfig extends Config = ResolvedRegister['config'],
  InternalContext = unknown,
>(
  parameters: UseSendTransactionParameters<
    InternalConfig,
    InternalContext
  > = {},
) {
  const dispatch = useAppDispatch();

  const { address } = useAccount();

  return useWagmiSendTransaction({
    ...parameters,
    mutation: {
      ...parameters.mutation,
      onSuccess(hash) {
        if (address) {
          dispatch(setAddressToPendingTxHash({ txHash: hash, address }));
        }
      },
    },
  });
}
