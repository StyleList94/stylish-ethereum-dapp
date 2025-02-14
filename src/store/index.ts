import { createStore } from 'zustand/vanilla';

import {
  createTransactionSlice,
  initialTxState,
  type TransactionSlice,
  type TransactionState,
} from '@/store/transaction';
import {
  type CounterSlice,
  type CounterState,
  createCounterSlice,
  initialCounterState,
} from '@/store/counter';

export type RootStore = TransactionSlice & CounterSlice;
export type RootState = TransactionState & CounterState;

const initialState: RootState = {
  ...initialTxState,
  ...initialCounterState,
};

export const createRootStore = (initState: RootState = initialState) =>
  createStore<RootStore>()((...rest) => ({
    ...initState,
    ...createTransactionSlice(...rest),
    ...createCounterSlice(...rest),
  }));
