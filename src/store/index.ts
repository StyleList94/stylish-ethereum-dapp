import { createStore } from 'zustand/vanilla';

import {
  createTransactionSlice,
  type TransactionSlice,
} from '@/store/transaction';
import { type CounterSlice, createCounterSlice } from '@/store/counter';

export type RootStore = TransactionSlice & CounterSlice;

export const createRootStore = () =>
  createStore<RootStore>()((...rest) => ({
    ...createTransactionSlice(...rest),
    ...createCounterSlice(...rest),
  }));
