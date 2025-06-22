import '@testing-library/jest-dom/vitest';

import { fireEvent, renderWithStore, screen } from '@/lib/test-utils';

import useRootStore from '@/store/hooks';
import { createRootStore } from '@/store';

import {
  FindPendingTxHashPayload,
  RemoveAddressToPendingTxHashPayload,
  SetAddressToPendingTxHashPayload,
  SetPendingTxHashPayload,
} from '@/store/transaction';

const address = '0x6fA655B3E290Eb5ab496bBAb5F314D9D1551e4A3' as `0x${string}`;
const chainId = 11155111;
const txHash =
  '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363' as `0x${string}`;
const storageKey = 'STYLISH_ETHEREUM_DAPP_PENDING_TX_HASH_LIST';

type ActionMap = {
  setPendingTxHash: SetPendingTxHashPayload;
  setAddressToPendingTxHash: SetAddressToPendingTxHashPayload;
  removeAddressToPendingTxHash: RemoveAddressToPendingTxHashPayload;
  findPendingTxHash: FindPendingTxHashPayload;
  resetPendingTxHash: Record<string, never>;
  resetPendingTxHashQueue: Record<string, never>;
};

type Action = {
  [K in keyof ActionMap]: { name: K; payload: ActionMap[K] };
}[keyof ActionMap];

const TxWithContext = () => {
  const {
    setPendingTxHash,
    setAddressToPendingTxHash,
    removeAddressToPendingTxHash,
    findPendingTxHash,
    resetPendingTxHash,
    resetPendingTxHashQueue,
  } = useRootStore((state) => state);

  const actions: Action[] = [
    { name: 'setPendingTxHash', payload: { txHash } },
    {
      name: 'setAddressToPendingTxHash',
      payload: { address, txHash, chainId },
    },
    {
      name: 'removeAddressToPendingTxHash',
      payload: { address, chainId },
    },
    {
      name: 'findPendingTxHash',
      payload: { address, chainId },
    },
    {
      name: 'resetPendingTxHash',
      payload: {},
    },
    {
      name: 'resetPendingTxHashQueue',
      payload: {},
    },
  ];

  const handleClick =
    ({ name, payload }: Action) =>
    () => {
      if (name === 'setPendingTxHash') {
        setPendingTxHash(payload);
      } else if (name === 'setAddressToPendingTxHash') {
        setAddressToPendingTxHash(payload);
      } else if (name === 'removeAddressToPendingTxHash') {
        removeAddressToPendingTxHash(payload);
      } else if (name === 'findPendingTxHash') {
        findPendingTxHash(payload);
      } else if (name === 'resetPendingTxHash') {
        resetPendingTxHash();
      } else {
        resetPendingTxHashQueue();
      }
    };

  return (
    <div>
      {actions.map((action) => (
        <button type="button" key={action.name} onClick={handleClick(action)}>
          {action.name}
        </button>
      ))}
    </div>
  );
};

describe('Transaction Store', () => {
  const setItemSpy = vi.spyOn(localStorage, 'setItem');
  const getItemSpy = vi.spyOn(localStorage, 'getItem');
  const removeItemSpy = vi.spyOn(localStorage, 'removeItem');

  beforeEach(() => {
    localStorage.clear();
    setItemSpy.mockClear();
    getItemSpy.mockClear();
  });

  it('should render with initial state', () => {
    const store = createRootStore();
    renderWithStore(<TxWithContext />, store);

    expect(store.getState().pendingTxHash).toBeNull();
    expect(store.getState().latestTxHash).toBeNull();
    expect(store.getState().pendingTxHashQueue).toEqual([]);
  });

  it('should set pending tx hash', () => {
    const store = createRootStore();
    renderWithStore(<TxWithContext />, store);

    fireEvent.click(screen.getByRole('button', { name: /^setPendingTxHash/i }));

    expect(store.getState().pendingTxHash).toBe(
      '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
    );
  });

  it('should control address to pending tx hash', () => {
    const store = createRootStore();
    renderWithStore(<TxWithContext />, store);

    fireEvent.click(
      screen.getByRole('button', { name: /setAddressToPendingTxHash/i }),
    );

    expect(store.getState().pendingTxHash).toBe(
      '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
    );
    expect(store.getState().pendingTxHashQueue).toEqual([
      '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
    ]);

    expect(getItemSpy).toHaveBeenCalledWith(storageKey);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify({
        [`${address}_${chainId}`]: [
          '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
        ],
      }),
    );

    fireEvent.click(
      screen.getByRole('button', { name: /removeAddressToPendingTxHash/i }),
    );

    expect(store.getState().pendingTxHash).toBeNull();
    expect(store.getState().pendingTxHashQueue).toEqual([]);

    expect(getItemSpy).toHaveBeenCalledWith(storageKey);

    expect(removeItemSpy).toHaveBeenCalledWith(storageKey);
  });

  it('should be found pending tx hash and reset state', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ [`${address}_${chainId}`]: [txHash] }),
    );

    const store = createRootStore();
    renderWithStore(<TxWithContext />, store);

    fireEvent.click(screen.getByRole('button', { name: /findPendingTxHash/i }));

    expect(store.getState().pendingTxHash).toBe(
      '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
    );
    expect(store.getState().pendingTxHashQueue).toEqual([
      '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
    ]);

    fireEvent.click(
      screen.getByRole('button', { name: /resetPendingTxHash$/i }),
    );
    expect(store.getState().pendingTxHash).toBeNull();

    fireEvent.click(
      screen.getByRole('button', { name: /resetPendingTxHashQueue/i }),
    );
    expect(store.getState().pendingTxHashQueue).toEqual([]);
  });
});
