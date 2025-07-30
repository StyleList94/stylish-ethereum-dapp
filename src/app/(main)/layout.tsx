import { ReactNode, Suspense } from 'react';

import LayoutContainer from '@/components/layout/container';
import GasTrackerLoader from '@/components/gas-tracker-loader';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutContainer>
      {children}
      {/* If you are not using Etherscan Gas Tracker, remove it. */}
      <Suspense fallback={null}>
        <GasTrackerLoader />
      </Suspense>
    </LayoutContainer>
  );
}
