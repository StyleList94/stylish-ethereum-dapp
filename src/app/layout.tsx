import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';

import { inter, robotoMono, titilliumWeb } from '@/assets/fonts';
import getConfig from '@/lib/config';

import AppProvider from '@/providers/app-provider';

import '@/styles/global.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dapp.stylelist94.dev'),
  title: 'Stylish Ethereum DApp',
  description: 'Create your Stylish DApp',
  keywords: ['DApp', 'Next.js template'],
  openGraph: {
    title: 'Stylish Ethereum DApp',
    description: 'Create your Stylish DApp',
    type: 'website',
    siteName: 'Stylish Ethereum DApp',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stylish Ethereum DApp',
    description: 'Create your Stylish DApp',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie'),
  );
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} ${titilliumWeb.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AppProvider initialState={initialState}>{children}</AppProvider>
      </body>
    </html>
  );
}
