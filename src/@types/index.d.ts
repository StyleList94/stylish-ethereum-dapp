import { MetaMaskInpageProvider } from '@metamask/providers';

import type { Klaytn } from 'types/klaytn';
import type { IpcProvider } from 'caver-js';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: IpcProvider & Klaytn;
  }
}

/* image module */
declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';

/* svg component */
declare module '*.svg' {
  import React from 'react';

  export const ReactComponent: React.FC<React.SVGProps<SVGElement>>;

  export default ReactComponent;
}
