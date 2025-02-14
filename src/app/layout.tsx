import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import { inter, robotoMono, titilliumWeb } from '@/assets/fonts';

import AppProvider from '@/providers/app-provider';

import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'Stylish Ethereum DApp',
  description: 'Your Stylish DApp',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} ${titilliumWeb.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
