import { mainnet, sepolia } from 'wagmi/chains';

import { POST } from './route';

const requestBlockNumberBody =
  '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}';

describe('/rpc/[network]', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.ALCHEMY_API_KEY = undefined;
  });

  it('should use mainnet public RPC', async () => {
    const mockResponse = new Response(requestBlockNumberBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));
    vi.stubEnv('ALCHEMY_API_KEY', undefined);

    const req = new Request('http://localhost:3000', {
      method: 'POST',
      body: requestBlockNumberBody,
    });
    const params = Promise.resolve({ network: 'mainnet' as const });

    const res = await POST(req, { params });

    expect(fetch).toHaveBeenCalledWith(
      mainnet.rpcUrls.default.http[0],
      expect.any(Object),
    );
    expect(res.status).toBe(200);
  });

  it('should use mainnet custom RPC', async () => {
    const mockResponse = new Response(requestBlockNumberBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));
    vi.stubEnv('ALCHEMY_API_KEY', 'OPEN_CAR');

    const req = new Request('http://localhost:3000', {
      method: 'POST',
      body: requestBlockNumberBody,
    });
    const params = Promise.resolve({ network: 'mainnet' as const });

    const res = await POST(req, { params });

    expect(fetch).toHaveBeenCalledWith(
      'https://eth-mainnet.g.alchemy.com/v2/OPEN_CAR',
      expect.any(Object),
    );
    expect(res.status).toBe(200);
  });

  it('should use sepolia public RPC', async () => {
    const mockResponse = new Response(requestBlockNumberBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));
    vi.stubEnv('ALCHEMY_API_KEY', undefined);

    const req = new Request('http://localhost:3000', {
      method: 'POST',
      body: requestBlockNumberBody,
    });
    const params = Promise.resolve({ network: 'sepolia' as const });

    const res = await POST(req, { params });

    expect(fetch).toHaveBeenCalledWith(
      sepolia.rpcUrls.default.http[0],
      expect.any(Object),
    );
    expect(res.status).toBe(200);
  });

  it('should use sepolia custom RPC', async () => {
    const mockResponse = new Response(requestBlockNumberBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));
    vi.stubEnv('ALCHEMY_API_KEY', 'OPEN_DOOR');

    const req = new Request('http://localhost:3000', {
      method: 'POST',
      body: requestBlockNumberBody,
    });
    const params = Promise.resolve({ network: 'sepolia' as const });

    const res = await POST(req, { params });

    expect(fetch).toHaveBeenCalledWith(
      'https://eth-sepolia.g.alchemy.com/v2/OPEN_DOOR',
      expect.any(Object),
    );
    expect(res.status).toBe(200);
  });
});
