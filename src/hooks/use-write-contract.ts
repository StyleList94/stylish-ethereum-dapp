import {
  useAccount,
  useWriteContract as useWagmiWriteContract,
  type Config,
  type ResolvedRegister,
  type UseWriteContractParameters,
  type UseWriteContractReturnType,
} from 'wagmi';

import useRootStore from '@/store/hooks';

export default function useWriteContract<
  InternalConfig extends Config = ResolvedRegister['config'],
  InternalContext = unknown,
>(
  parameters: UseWriteContractParameters<InternalConfig, InternalContext> = {},
): UseWriteContractReturnType<InternalConfig, InternalContext> {
  const { setAddressToPendingTxHash } = useRootStore((state) => state);

  const { address, chainId } = useAccount();

  return useWagmiWriteContract({
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
