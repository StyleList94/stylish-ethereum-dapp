import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

type State = {
  prev: string;
};

const initialState: State = {
  prev: '/',
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPrevPage: (state, action: PayloadAction<string>) => {
      state.prev = action.payload;
    },
  },
});

export const { setPrevPage } = pageSlice.actions;

export default pageSlice.reducer;
