import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export default function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
    ssr: true,
    transports: {
      [mainnet.id]: http(
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
          ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          : undefined,
      ),
      [sepolia.id]: http(
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
          ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          : undefined,
      ),
    },
    storage: createStorage({
      storage: cookieStorage,
    }),
    connectors: [injected({ target: 'metaMask' })],
  });
}
