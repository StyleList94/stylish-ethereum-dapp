import { Global } from '@emotion/react';
import { configureChains, chain, WagmiConfig, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';

import { store } from 'store';
import styles from 'styles';

import KlaytnProvider from '@/contexts/KlaytnContext';
import RouteProgress from '@/components/RouteProgress';

import 'react-toastify/dist/ReactToastify.css';

const bscChain = {
  id: 56,
  name: 'BNB Smart Chain Mainnet',
  network: 'binance',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://bsc-dataseed1.binance.org/',
  },
  blockExplorers: {
    default: { name: 'BSCScan', url: 'https://bscscan.com/' },
  },
  testnet: false,
};

const bscTestnetChain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'binanceTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tBNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  },
  blockExplorers: {
    default: { name: 'BSCScan', url: 'https://testnet.bscscan.com/' },
  },
  testnet: true,
};

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.rinkeby,
    chain.polygon,
    chain.polygonMumbai,
    bscChain,
    bscTestnetChain,
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default }),
    }),
    publicProvider(),
  ],
  { targetQuorum: 2 },
);

const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
  ],
});

const AppProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <WagmiConfig client={client}>
        <KlaytnProvider>
          <RouteProgress />
          <Global styles={styles} />
          {children}
          <ToastContainer />
        </KlaytnProvider>
      </WagmiConfig>
    </Provider>
  );
};

export default AppProvider;
