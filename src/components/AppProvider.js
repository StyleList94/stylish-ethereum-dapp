import { Global } from '@emotion/react';
import { configureChains, WagmiConfig, createClient } from 'wagmi';
import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';

import { store } from 'store';
import styles from 'styles';

import KlaytnProvider from '@/contexts/KlaytnContext';
import RouteProgress from '@/components/RouteProgress';

import 'react-toastify/dist/ReactToastify.css';

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet],
  [publicProvider()],
  { targetQuorum: 1 },
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
