import { KaikasRpcError } from 'lib/errors';

interface State {
  isEnabled: boolean;
  isUnlocked: boolean;
  networkVersion: number;
  onboardingcomplete: boolean;
}

interface Store {
  subscribe: (callback: () => void) => void;
  getState: () => State;
}

export interface Klaytn {
  on: (
    eventName: string,
    callback: (...args: [emitter: string & number]) => void | Promise<void>,
  ) => void;
  enable: () => Promise<Array<string>>;
  selectedAddress: string;
  networkVersion: number;
  publicConfigStore: Store;
  sendAsync: (
    options: { method: string; params?: unknown[] | object },
    callback: (
      error: KaikasRpcError,
      result: {
        id: string | undefined;
        jsonrpc: '2.0';
        method: string;
        result?: unknown;
        error?: KaikasRpcError;
      },
    ) => void,
  ) => unknown;
  request: (options: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
}
