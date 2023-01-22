import { MetaMaskInpageProvider } from '@metamask/providers';

import type { Klaytn } from 'types/klaytn';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: Klaytn;
  }
}
