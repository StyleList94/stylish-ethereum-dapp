import { configureStore } from '@reduxjs/toolkit';

import pageReducer from 'store/page';
import txReducer from 'store/transaction';

export const store = configureStore({
  reducer: { page: pageReducer, transaction: txReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
