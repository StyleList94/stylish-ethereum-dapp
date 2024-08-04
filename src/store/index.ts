import { configureStore } from '@reduxjs/toolkit';

import pageReducer from '@/store/page';
import txReducer from '@/store/transaction';

export const makeStore = () =>
  configureStore({
    reducer: { page: pageReducer, transaction: txReducer },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
