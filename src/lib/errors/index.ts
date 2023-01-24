export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export class KaikasRpcError implements ProviderRpcError {
  public code: number;

  public message: string;

  public name: string;

  public data?: unknown;

  constructor(code: number, message: string, data?: unknown) {
    this.code = code;
    this.message = message;
    this.name = 'Kaikas RPC Error';
    this.data = data;
  }
}
