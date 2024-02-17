'use client';

import { useAccount } from 'wagmi';

import useMounted from 'hooks/use-mounted';

import Account from '@/components/account';
import Network from '@/components/network';
import SignMessage from '@/components/sign-message';
import SendTransaction from '@/components/send-transaction';

export default function IndexPage() {
  const { isConnected } = useAccount();

  const isMounted = useMounted();

  return (
    <section className="flex flex-col justify-center items-center gap-8 p-12">
      <h1 className="text-2xl">Stylish Ethereum DApp</h1>
      <Account />
      {isMounted && isConnected && <Network />}
      {isMounted && isConnected && <SignMessage />}
      {isMounted && isConnected && <SendTransaction />}
    </section>
  );
}
