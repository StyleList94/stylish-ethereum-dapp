import React from 'react';
import Caver from 'caver-js';
import {
  KlaytnStateContext,
  KlaytnDispatchContext,
} from '@/contexts/KlaytnContext';

const KLAYTN_RPC_URL =
  process.env.NEXT_PUBLIC_ENV === 'dev'
    ? 'https://api.baobab.klaytn.net:8651/'
    : 'https://public-node-api.klaytnapi.com/v1/cypress';

export default function useKlaytn() {
  const state = React.useContext(KlaytnStateContext);
  const dispatch = React.useContext(KlaytnDispatchContext);

  if (!state || !dispatch) {
    throw new Error('useKlaytn must be used within a KlaytnProvider');
  }

  const setAccountInfo = React.useCallback(
    async (accounts: string[]) => {
      const localCaver = new Caver(KLAYTN_RPC_URL);

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

  const activate = React.useCallback(async () => {
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
      dispatch({ type: 'SET_ACTIVE', payload: true });
    } else {
      throw new Error('Klaytn wallet is not available');
    }
  }, [state.klaytn, setAccountInfo, dispatch]);

  const deactivate = React.useCallback(() => {
    dispatch({ type: 'SET_ACCOUNT', payload: null });
    dispatch({
      type: 'SET_BALANCE',
      payload: null,
    });
    dispatch({ type: 'SET_ACTIVE', payload: false });
  }, [dispatch]);

  React.useEffect(() => {
    if (state.klaytn) {
      dispatch({ type: 'SET_CAVER', payload: new Caver(KLAYTN_RPC_URL) });
    }
  }, [state.klaytn, dispatch]);

  const key = React.useMemo(
    () => ({ ...state, activate, deactivate }),
    [state, activate, deactivate],
  );

  return { ...key };
}
