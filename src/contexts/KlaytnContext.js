import React from 'react';

function reducer(state, action) {
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
    case 'SET_ACTIVE':
      return {
        ...state,
        active: action.payload,
      };
    default:
      return state;
  }
}

const initialState = {
  klaytn: typeof window !== 'undefined' ? window.klaytn : null,
  account: null,
  balance: null,
  caver: null,
  active: false,
};

export const KlaytnStateContext = React.createContext(initialState);
export const KlaytnDispatchContext = React.createContext(null);

const KlaytnProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch({ type: 'SET_KLAUTN', payload: window.klaytn });
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
