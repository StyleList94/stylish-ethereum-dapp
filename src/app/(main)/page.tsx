import { cn } from '@/lib/utils';

import Account from '@/components/account';
import Network from '@/components/network';
import TransactionCenter from '@/components/transaction-center';
import UnitConverter from '@/components/unit-converter';
import SmartContractLauncher from '@/components/smart-contract-launcher';
import SignMessage from '@/components/sign-message';
import SendTransaction from '@/components/send-transaction';

export default async function MainPage() {
  return (
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
        <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
          <Account />
          <Network />
        </div>
        <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
          <TransactionCenter />
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
          <SmartContractLauncher />
        </div>
        <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
          <SignMessage />
          <SendTransaction />
        </div>
      </div>
    </section>
  );
}
