import { type StateCreator } from 'zustand';

import { type RootStore } from '@/store/index';

export type CounterState = {
  count: number;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
};

export type CounterSlice = CounterState & CounterActions;

const initialCounterState: CounterState = {
  count: 0,
};

export const createCounterSlice: StateCreator<
  RootStore,
  [],
  [],
  CounterSlice
> = (set) => ({
  ...initialCounterState,
  decrementCount: () => set((state) => ({ count: state.count - 1 })),
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
});
