import { type ReactNode, createContext, useRef } from 'react';

import { createRootStore } from '@/store';

type Props = {
  children: ReactNode;
};

export type StoreApi = ReturnType<typeof createRootStore>;

export const StoreContext = createContext<StoreApi | undefined>(undefined);

const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<StoreApi>(null);

  storeRef.current ??= createRootStore();

  return <StoreContext value={storeRef.current}>{children}</StoreContext>;
};

export default StoreProvider;
