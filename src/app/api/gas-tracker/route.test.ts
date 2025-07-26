import { GET } from './route';

describe('api/gas-tracker', () => {
  const mockResponse = {
    status: '1',
    message: 'OK',
    result: {
      LastBlock: '23003980',
      SafeGasPrice: '10',
      ProposeGasPrice: '20',
      FastGasPrice: '30',
      suggestBaseFee: '50',
      gasUsedRatio: '0.5',
    },
  };

  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it('returns 400 if api key is not set', async () => {
    vi.stubEnv('ETHERSCAN_API_KEY', undefined);

    const res = await GET();

    expect(res.status).toBe(401);
    const body = (await res.json()) as { message: string };
    expect(body.message).toBe('ETHERSCAN_API_KEY is required');
  });

  it('fetches data and returns JSON response when api key is set', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('ETHERSCAN_API_KEY', '486');

    const res = await GET();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=486',
    );

    expect(res.status).toBe(200);

    const json = (await res.json()) as unknown;
    expect(json).toEqual({
      lastBlock: '23003980',
      safeGasPrice: '10',
      averageGasPrice: '20',
      fastGasPrice: '30',
      status: 'OK',
    });
  });
});
