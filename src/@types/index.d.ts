import { MetaMaskInpageProvider } from '@metamask/providers';

import type { Klaytn } from 'types/klaytn';
import type { IpcProvider } from 'caver-js';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: Klaytn & IpcProvider;
  }
}
