import React from 'react';
import Caver, { IpcProvider } from 'caver-js';

import type { Dispatch } from 'react';
import type { Klaytn } from 'types/klaytn';

type State = {
  klaytn: (Klaytn & IpcProvider) | null;
  account: string | null;
  balance: string | null;
  caver: Caver | null;
  isConnected: boolean;
};

type Action =
  | {
      type: 'SET_KLAYTN';
      payload: (Klaytn & IpcProvider) | null;
    }
  | {
      type: 'SET_ACCOUNT';
      payload: string | null;
    }
  | {
      type: 'SET_BALANCE';
      payload: string | null;
    }
  | {
      type: 'SET_CAVER';
      payload: Caver | null;
    }
  | {
      type: 'SET_IS_CONNECTED';
      payload: boolean;
    };

type KlaytnDispatch = Dispatch<Action>;

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_KLAYTN':
      return {
        ...state,
        klaytn: action.payload,
      };
    case 'SET_ACCOUNT':
      return {
        ...state,
        account: action.payload,
      };
    case 'SET_BALANCE':
      return {
        ...state,
        balance: action.payload,
      };
    case 'SET_CAVER':
      return {
        ...state,
        caver: action.payload,
      };
    case 'SET_IS_CONNECTED':
      return {
        ...state,
        isConnected: action.payload,
      };
    default:
      return state;
  }
}
const initialState: State = {
  klaytn: typeof window === 'undefined' ? null : window.klaytn,
  account: null,
  balance: null,
  caver: null,
  isConnected: false,
};

export const KlaytnStateContext = React.createContext<State | null>(null);
export const KlaytnDispatchContext = React.createContext<KlaytnDispatch | null>(
  null,
);

const KlaytnProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({ type: 'SET_KLAYTN', payload: window.klaytn });
  }, []);

  return (
    <KlaytnStateContext.Provider value={state}>
      <KlaytnDispatchContext.Provider value={dispatch}>
        {children}
      </KlaytnDispatchContext.Provider>
    </KlaytnStateContext.Provider>
  );
};

export default KlaytnProvider;
