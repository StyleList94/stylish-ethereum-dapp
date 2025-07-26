import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export default function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
    ssr: true,
    transports: {
      [mainnet.id]: http('/rpc/mainnet'),
      [sepolia.id]: http('/rpc/sepolia'),
    },
    storage: createStorage({
      storage: cookieStorage,
    }),
    connectors: [injected({ target: 'metaMask' })],
  });
}
