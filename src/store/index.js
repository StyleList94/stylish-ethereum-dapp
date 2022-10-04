import { configureStore } from '@reduxjs/toolkit';

import pageReducer from './page';

export const store = configureStore({
  reducer: { page: pageReducer },
});
