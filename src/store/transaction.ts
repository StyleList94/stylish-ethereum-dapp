import { type StateCreator } from 'zustand';

import { type RootStore } from '@/store/index';

const WEB_STORAGE_PREFIX = 'STYLISH_ETHEREUM_DAPP';

export type TransactionState = {
  pendingTxHash: `0x${string}` | null;
  latestTxHash: `0x${string}` | null;
  pendingTxHashQueue: `0x${string}`[];
};

export type FindPendingTxHashPayload = {
  address: `0x${string}`;
  chainId: number;
};

export type SetAddressToPendingTxHashPayload = {
  address: `0x${string}`;
  chainId: number;
  txHash: `0x${string}`;
  isReplace?: boolean;
};

export type RemoveAddressToPendingTxHashPayload = {
  address: `0x${string}`;
  chainId: number;
};

export type SetPendingTxHashPayload = {
  txHash: `0x${string}`;
};

export type TransactionActions = {
  findPendingTxHash: (payload: FindPendingTxHashPayload) => void;
  setAddressToPendingTxHash: (
    payload: SetAddressToPendingTxHashPayload,
  ) => void;
  removeAddressToPendingTxHash: (
    payload: RemoveAddressToPendingTxHashPayload,
  ) => void;
  setPendingTxHash: (payload: SetPendingTxHashPayload) => void;
  resetPendingTxHash: () => void;
  resetPendingTxHashQueue: () => void;
};

export type TransactionSlice = TransactionState & TransactionActions;

type PendingTxList = Record<string, `0x${string}`[]>;

const initialTxState: TransactionState = {
  pendingTxHash: null,
  latestTxHash: null,
  pendingTxHashQueue: [],
};

export const createTransactionSlice: StateCreator<
  RootStore,
  [],
  [],
  TransactionSlice
> = (set) => ({
  ...initialTxState,
  findPendingTxHash: (payload) =>
    set((prevState) => {
      const { address, chainId } = payload;
      const pendingTxList = localStorage.getItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
      );

      if (!pendingTxList) {
        return prevState;
      }

      const queryKey = `${address}_${chainId}`;

      const txHashQueue =
        (JSON.parse(pendingTxList) as PendingTxList)[queryKey] ?? [];

      return {
        ...prevState,
        pendingTxHashQueue: txHashQueue,
        pendingTxHash: txHashQueue[0] || null,
      };
    }),

  setAddressToPendingTxHash: (payload: SetAddressToPendingTxHashPayload) =>
    set((prevState) => {
      const { address, chainId, txHash, isReplace } = payload;
      const rawPendingTxList = localStorage.getItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
      );

      const pendingTxList = JSON.parse(
        rawPendingTxList ?? '{}',
      ) as PendingTxList;

      const targetKey = `${address}_${chainId}`;

      const addressToPendingTxHashQueue = pendingTxList[targetKey] ?? [];
      const nextPendingTxHashQueue = isReplace
        ? [txHash, ...addressToPendingTxHashQueue.slice(1)]
        : [...addressToPendingTxHashQueue, txHash];

      localStorage.setItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
        JSON.stringify({
          ...pendingTxList,
          [targetKey]: nextPendingTxHashQueue,
        }),
      );

      return {
        ...prevState,
        pendingTxHash: nextPendingTxHashQueue[0] || null,
        pendingTxHashQueue: nextPendingTxHashQueue,
      };
    }),

  removeAddressToPendingTxHash: (
    payload: RemoveAddressToPendingTxHashPayload,
  ) =>
    set((prevState) => {
      const { address, chainId } = payload;
      const rawPendingTxList = localStorage.getItem(
        `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
      );

      if (!rawPendingTxList) {
        return prevState;
      }

      const queryKey = `${address}_${chainId}`;

      const filteredPendingTxList = JSON.parse(
        rawPendingTxList,
      ) as PendingTxList;
      const txHashQueue = filteredPendingTxList[queryKey] ?? [];

      let nextPendingTxHash: TransactionState['pendingTxHash'];
      let nextPendingTxHashQueue: TransactionState['pendingTxHashQueue'];

      const latestTxHash = txHashQueue.shift() ?? null;

      if (!txHashQueue.length) {
        nextPendingTxHash = null;
        nextPendingTxHashQueue = [];

        Reflect.deleteProperty(filteredPendingTxList, queryKey);

        if (!Object.keys(filteredPendingTxList).length) {
          localStorage.removeItem(`${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`);
        }
      } else {
        nextPendingTxHash = txHashQueue[0] || null;
        nextPendingTxHashQueue = txHashQueue;

        localStorage.setItem(
          `${WEB_STORAGE_PREFIX}_PENDING_TX_HASH_LIST`,
          JSON.stringify({
            ...filteredPendingTxList,
            [queryKey]: txHashQueue,
          }),
        );
      }

      return {
        ...prevState,
        latestTxHash,
        pendingTxHash: nextPendingTxHash,
        pendingTxHashQueue: nextPendingTxHashQueue,
      };
    }),
  setPendingTxHash: (payload: SetPendingTxHashPayload) =>
    set((prevState) => ({
      ...prevState,
      pendingTxHash: payload.txHash,
    })),

  resetPendingTxHash: () =>
    set((prevState) => ({
      ...prevState,
      pendingTxHash: initialTxState.pendingTxHash,
    })),

  resetPendingTxHashQueue: () =>
    set((prevState) => ({
      ...prevState,
      pendingTxHashQueue: initialTxState.pendingTxHashQueue,
    })),
});
