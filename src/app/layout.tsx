import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

import { inter, robotoMono, titilliumWeb } from '@/assets/fonts';

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
