import React from 'react';
import { Global } from '@emotion/react';
import { configureChains, WagmiConfig, createConfig } from 'wagmi';
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

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet],
  [publicProvider()],
);

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({ chains }),
  ],
});

const AppProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <WagmiConfig config={config}>
      <KlaytnProvider>
        <RouteProgress />
        <Global styles={styles} />
        {children}
        <ToastContainer />
      </KlaytnProvider>
    </WagmiConfig>
  </Provider>
);

export default AppProvider;
