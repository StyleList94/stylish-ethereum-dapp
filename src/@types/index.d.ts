import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
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
