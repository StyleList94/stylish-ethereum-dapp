import {
  useAccount,
  useSendTransaction as useWagmiSendTransaction,
  type Config,
  type ResolvedRegister,
  type UseSendTransactionParameters,
  type UseSendTransactionReturnType,
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
): UseSendTransactionReturnType<InternalConfig, InternalContext> {
  const { setAddressToPendingTxHash } = useRootStore((state) => state);

  const { address, chainId } = useAccount();

  return useWagmiSendTransaction({
    ...parameters,
    mutation: {
      onSuccess(hash) {
        if (address && chainId) {
          setAddressToPendingTxHash({ txHash: hash, address, chainId });
        }
      },
      ...parameters.mutation,
    },
  });
}
