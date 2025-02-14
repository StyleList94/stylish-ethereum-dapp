import {
  useAccount,
  useSendTransaction as useWagmiSendTransaction,
  type Config,
  type ResolvedRegister,
  type UseSendTransactionParameters,
} from 'wagmi';

import useRootStore from '@/store/hooks';

export default function useSendTransaction<
  InternalConfig extends Config = ResolvedRegister['config'],
  InternalContext = unknown,
>(
  parameters: UseSendTransactionParameters<
    InternalConfig,
    InternalContext
  > = {},
) {
  const { setAddressToPendingTxHash } = useRootStore((state) => state);

  const { address } = useAccount();

  return useWagmiSendTransaction({
    ...parameters,
    mutation: {
      ...parameters.mutation,
      onSuccess(hash) {
        if (address) {
          setAddressToPendingTxHash({ txHash: hash, address });
        }
      },
    },
  });
}
