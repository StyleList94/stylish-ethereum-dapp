import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { inter, robotoMono } from '@/assets/fonts';

import Providers from '@/components/providers';

import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'Stylish Ethereum App',
  description: 'Your Stylish DApp',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
