import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  prev: '/',
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPrevPage: (state, action) => {
      state.prev = action.payload;
    },
  },
});

export const { setPrevPage } = pageSlice.actions;

export default pageSlice.reducer;
