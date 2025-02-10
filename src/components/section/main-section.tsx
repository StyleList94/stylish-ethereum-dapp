'use client';

import { useAccount } from 'wagmi';

import useMounted from '@/hooks/use-mounted';

import Container from '@/components/layout/container';
import Account from '@/components/account';
import Network from '@/components/network';
import SignMessage from '@/components/sign-message';
import SendTransaction from '@/components/send-transaction';

const MainSection = () => {
  const { isConnected } = useAccount();

  const isMounted = useMounted();

  return (
    <Container>
      <section className="flex flex-col justify-center items-center gap-8 p-6">
        <Account />
        {isMounted && isConnected && <Network />}
        {isMounted && isConnected && <SignMessage />}
        {isMounted && isConnected && <SendTransaction />}
      </section>
    </Container>
  );
};

export default MainSection;
