import Head from 'next/head';
import { useAccount } from 'wagmi';
import styled from '@emotion/styled';

import useMounted from 'hooks/useMounted';

import type { ReactElement } from 'react';

import Account from '@/components/Account';
import Network from '@/components/Network';
import SignMessage from '@/components/SignMessage';
import SendTransaction from '@/components/SendTransaction';

const PageContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 3rem;
`;

const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-weight: normal;
  font-size: 1.5rem;
`;

export default function IndexPage() {
  const { isConnected } = useAccount();

  const isMounted = useMounted();

  return (
    <PageContainer>
      <PageTitle>Stylish Ethereum DApp</PageTitle>
      <Account />
      {isMounted && isConnected && <Network />}
      {isMounted && isConnected && <SignMessage />}
      {isMounted && isConnected && <SendTransaction />}
    </PageContainer>
  );
}

IndexPage.getLayout = (page: ReactElement) => (
  <>
    <Head>
      <title>Stylish Ethereum DApp</title>
    </Head>
    {page}
  </>
);
