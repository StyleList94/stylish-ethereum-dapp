'use client';

import { type MouseEventHandler, useCallback, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import Account from '@/components/account';
import Network from '@/components/network';
import TransactionCenter from '@/components/transaction-center';
import UnitConverter from '@/components/unit-converter';
import SmartContractLauncher from '@/components/smart-contract-launcher';
import SignMessage from '@/components/sign-message';
import SendTransaction from '@/components/send-transaction';

type TabValue = 'all' | 'network' | 'sign' | 'tx';

const tabs: { text: string; value: TabValue }[] = [
  { text: 'All', value: 'all' },
  { text: 'Network', value: 'network' },
  { text: 'Signature', value: 'sign' },
  { text: 'Transaction', value: 'tx' },
];

const TabContent = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    data-state={isActive ? 'active' : 'inactive'}
    className={cn(
      "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function Features() {
  const [activeTab, setActiveTab] = useState<TabValue>('all');

  const shouldRender = useCallback(
    (specificTabs: TabValue[] = []) => {
      if (activeTab === 'all') return true;
      return specificTabs.includes(activeTab);
    },
    [activeTab],
  );

  const showAccount = useMemo(
    () => shouldRender(['network', 'sign', 'tx']),
    [shouldRender],
  );
  const showNetwork = useMemo(
    () => shouldRender(['network', 'tx']),
    [shouldRender],
  );
  const showTransactionCenter = useMemo(
    () => shouldRender(['tx']),
    [shouldRender],
  );
  const showUnitConverter = useMemo(() => shouldRender(['tx']), [shouldRender]);
  const showSmartContractLauncher = useMemo(
    () => shouldRender(['tx']),
    [shouldRender],
  );
  const showSignMessage = useMemo(() => shouldRender(['sign']), [shouldRender]);
  const showSendTransaction = useMemo(
    () => shouldRender(['tx']),
    [shouldRender],
  );

  return (
    <>
      <div className="sticky top-14 z-10 flex flex-wrap items-center gap-2 py-4 bg-background">
        <div className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]">
          {tabs.map((tab) => (
            <TabContent
              key={tab.value}
              isActive={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.text}
            </TabContent>
          ))}
        </div>
      </div>

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
          {(showAccount || showNetwork) && (
            <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
              {showAccount && <Account />}
              {showNetwork && <Network />}
            </div>
          )}
          {(showSignMessage || showUnitConverter) && (
            <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
              {showSignMessage && <SignMessage />}
              {showUnitConverter && <UnitConverter />}
            </div>
          )}
        </div>
        <div
          className={cn(
            'grid grid-cols-1 gap-4',
            'md:items-start',
            'xl:grid-cols-2',
          )}
        >
          {(showTransactionCenter || showSmartContractLauncher) && (
            <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
              {showTransactionCenter && <TransactionCenter />}
              {showSmartContractLauncher && <SmartContractLauncher />}
            </div>
          )}
          {(showTransactionCenter || showSendTransaction) && (
            <div className={cn('grid grid-cols-1 gap-4', 'md:items-start')}>
              {showSendTransaction && <SendTransaction />}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
