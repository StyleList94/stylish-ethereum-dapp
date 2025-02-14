import { useContext } from 'react';
import { useStore } from 'zustand';

import { StoreContext } from '@/providers/store-provider';
import { type RootStore } from '@/store/index';

const useRootStore = <T>(selector: (store: RootStore) => T): T => {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    throw new Error('useAppStore must be used within StoreProvider');
  }

  return useStore(storeContext, selector);
};

export default useRootStore;
