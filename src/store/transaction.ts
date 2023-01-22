import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

const WEB_STORAGE_PREFIX = 'STYLISH_ETHEREUM_DAPP';

type State = {
  pendingTxHash: `0x${string}` | null;
  latestTxHash: `0x${string}` | null;
  pendingTxHashQueue: `0x${string}`[];
};

type PendingTxList = { [key: string]: `0x${string}`[] };

type PayloadFindPendingTxHash = {
  address: `0x${string}`;
};

type PayloadSetAddressToPendingTxHash = {
  address: `0x${string}`;
  txHash: `0x${string}`;
};

type PayloadRemoveAddressToPendingTxHash = {
  address: `0x${string}`;
};

type PayloadSetPendingTxHash = {
  txHash: `0x${string}`;
};

const initialState: State = {
  pendingTxHash: null,
  latestTxHash: null,
  pendingTxHashQueue: [],
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    findPendingTxHash: (
      state,
      action: PayloadAction<PayloadFindPendingTxHash>,
    ) => {
      const { address } = action.payload;
      const pendingTxList = localStorage.getItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
      );

      if (pendingTxList) {
        const txHashQueue =
          (JSON.parse(pendingTxList) as PendingTxList)?.[address] ?? [];

        state.pendingTxHashQueue = txHashQueue;
        state.pendingTxHash = txHashQueue[0];
      }
    },
    setAddressToPendingTxHash: (
      state,
      action: PayloadAction<PayloadSetAddressToPendingTxHash>,
    ) => {
      const { address, txHash } = action.payload;
      const rawPendingTxList = localStorage.getItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
      );

      const pendingTxList = JSON.parse(
        rawPendingTxList ?? '{}',
      ) as PendingTxList;

      const addressToPendingTxHashQueue = pendingTxList?.[address] ?? [];
      const nextPendingTxHashQueue = [...addressToPendingTxHashQueue, txHash];

      localStorage.setItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
        JSON.stringify({
          ...pendingTxList,
          [address]: [...addressToPendingTxHashQueue, txHash],
        }),
      );

      state.pendingTxHash = nextPendingTxHashQueue[0];
      state.pendingTxHashQueue = nextPendingTxHashQueue;
    },
    removeAddressToPendingTxHash: (
      state,
      action: PayloadAction<PayloadRemoveAddressToPendingTxHash>,
    ) => {
      const { address } = action.payload;
      const rawPendingTxList = localStorage.getItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
      );

      if (rawPendingTxList) {
        const filteredPendingTxList = JSON.parse(
          rawPendingTxList,
        ) as PendingTxList;
        const txHashQueue = filteredPendingTxList?.[address] ?? [];

        state.latestTxHash = txHashQueue.shift() ?? null;

        if (!txHashQueue.length) {
          state.pendingTxHash = null;
          state.pendingTxHashQueue = [];
          Reflect.deleteProperty(filteredPendingTxList, address);

          if (!Object.keys(filteredPendingTxList).length) {
            localStorage.removeItem(
              `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
            );
          }
        } else {
          state.pendingTxHash = txHashQueue[0];
          state.pendingTxHashQueue = txHashQueue;
          localStorage.setItem(
            `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
            JSON.stringify({
              ...filteredPendingTxList,
              [address]: txHashQueue,
            }),
          );
        }
      }
    },
    setPendingTxHash: (
      state,
      action: PayloadAction<PayloadSetPendingTxHash>,
    ) => {
      const { txHash } = action.payload;
      state.pendingTxHash = txHash;
    },
    resetPendingTxHash: (state) => {
      state.pendingTxHash = initialState.pendingTxHash;
    },
    resetPendingTxHashQueue: (state) => {
      state.pendingTxHashQueue = initialState.pendingTxHashQueue;
    },
  },
});

export const {
  findPendingTxHash,
  setAddressToPendingTxHash,
  removeAddressToPendingTxHash,
  setPendingTxHash,
  resetPendingTxHash,
  resetPendingTxHashQueue,
} = transactionSlice.actions;

export default transactionSlice.reducer;
