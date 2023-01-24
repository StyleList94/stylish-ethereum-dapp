import React from 'react';
import Caver from 'caver-js';

import type { IpcProvider } from 'caver-js';

import {
  KlaytnStateContext,
  KlaytnDispatchContext,
} from '@/contexts/KlaytnContext';

export default function useKlaytn() {
  const state = React.useContext(KlaytnStateContext);
  const dispatch = React.useContext(KlaytnDispatchContext);

  if (!state || !dispatch) {
    throw new Error('useKlaytn must be used within a KlaytnProvider');
  }

  const setAccountInfo = React.useCallback(
    async (accounts: string[]) => {
      const localCaver = new Caver(state.klaytn as IpcProvider);

      const account = state.klaytn?.selectedAddress || accounts[0];
      const balance = await localCaver.klay.getBalance(account);
      dispatch({ type: 'SET_ACCOUNT', payload: account });
      dispatch({
        type: 'SET_BALANCE',
        payload: localCaver.utils.fromPeb(balance, 'KLAY'),
      });
    },
    [state.klaytn, dispatch],
  );

  const connect = React.useCallback(async () => {
    if (state.klaytn) {
      try {
        const accounts = await state.klaytn.enable();

        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });
        await setAccountInfo(accounts);
      } catch (error) {
        throw new Error('User denied account');
      }
      dispatch({ type: 'SET_IS_CONNECTED', payload: true });
    } else {
      throw new Error('Klaytn wallet is not available');
    }
  }, [state.klaytn, setAccountInfo, dispatch]);

  const disconnect = React.useCallback(() => {
    dispatch({ type: 'SET_ACCOUNT', payload: null });
    dispatch({
      type: 'SET_BALANCE',
      payload: null,
    });
    dispatch({ type: 'SET_IS_CONNECTED', payload: false });
  }, [dispatch]);

  React.useEffect(() => {
    if (state.klaytn) {
      dispatch({
        type: 'SET_CAVER',
        payload: new Caver(state.klaytn as IpcProvider),
      });

      state.klaytn.on('accountsChanged', async () => {
        await connect();
      });
      state.klaytn.on('networkChanged', async (networkId: number) => {
        window.klaytn.networkVersion = networkId;
        await connect();
      });
      state.klaytn.on('disconnected', () => {
        disconnect();
      });
    }

    return () => {
      if (state.klaytn) {
        state.klaytn.on('accountsChanged', () => {});
        state.klaytn.on('networkChanged', () => {});
        state.klaytn.on('disconnected', () => {});
      }
    };
  }, [state.klaytn, connect, disconnect, dispatch]);

  const key = React.useMemo(
    () => ({ ...state, connect, disconnect }),
    [state, connect, disconnect],
  );

  return { ...key };
}
