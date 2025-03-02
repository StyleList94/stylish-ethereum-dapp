'use client';

import { useAccount } from 'wagmi';

import useMounted from '@/hooks/use-mounted';

import Container from '@/components/layout/container';
import Account from '@/components/account';
import Network from '@/components/network';
import SignMessage from '@/components/sign-message';
import SendTransaction from '@/components/send-transaction';
import { cn } from '@/lib/utils';
import SmartContractLauncher from '@/components/smart-contract-launcher';
import UnitConverter from '@/components/unit-converter';

const MainSection = () => {
  const { isConnected } = useAccount();

  const isMounted = useMounted();

  return (
    <Container>
      <section
        className={cn(
          'grid grid-cols-1 gap-4 py-6',
          'md:grid-cols-2 md:items-start',
        )}
      >
        <div
          className={cn(
            'grid grid-cols-1 gap-4',
            'md:items-start',
            'xl:grid-cols-2',
          )}
        >
          <Account />
          <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
            {isMounted && isConnected && <Network />}
            <UnitConverter />
          </div>
        </div>
        <div
          className={cn(
            'grid grid-cols-1 gap-4',
            'md:items-start',
            'xl:grid-cols-2',
          )}
        >
          <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
            {isMounted && isConnected && <SmartContractLauncher />}
            {isMounted && isConnected && <SignMessage />}
          </div>
          {isMounted && isConnected && <SendTransaction />}
        </div>
      </section>
    </Container>
  );
};

export default MainSection;
