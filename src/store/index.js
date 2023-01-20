import { configureStore } from '@reduxjs/toolkit';

import pageReducer from './page';
import txReducer from './transaction';

export const store = configureStore({
  reducer: { page: pageReducer, transaction: txReducer },
});
