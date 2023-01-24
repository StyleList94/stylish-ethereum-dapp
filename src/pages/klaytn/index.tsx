import Head from 'next/head';
import styled from '@emotion/styled';

import useKlaytn from 'hooks/useKlaytn';

import type { ReactElement } from 'react';

import KlaytnAccount from '@/components/klaytn/KlaytnAccount';
import KlaytnNetwork from '@/components/klaytn/KlaytnNetwork';
import KlaytnSignMessage from '@/components/klaytn/KlaytnSignMessage';
import KlaytnSendTransaction from '@/components/klaytn/KlaytnSendTransaction';

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

export default function KlaytnPage() {
  const { isConnected } = useKlaytn();

  return (
    <PageContainer>
      <PageTitle>Stylish Klaytn BApp</PageTitle>
      <KlaytnAccount />
      {isConnected && <KlaytnNetwork />}
      {isConnected && <KlaytnSignMessage />}
      {isConnected && <KlaytnSendTransaction />}
    </PageContainer>
  );
}

KlaytnPage.getLayout = (page: ReactElement) => (
  <>
    <Head>
      <title>Stylish Ethereum DApp</title>
    </Head>
    {page}
  </>
);
