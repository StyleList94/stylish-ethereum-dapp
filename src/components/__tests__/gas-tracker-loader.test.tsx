import '@testing-library/jest-dom/vitest';

import { render } from '@/lib/test-utils';

import GasTrackerLoader from '../gas-tracker-loader';

const mockData = {
  lastBlock: '23003980',
  safeGasPrice: '10',
  averageGasPrice: '20',
  fastGasPrice: '30',
  status: 'OK',
};

describe('<GasTrackerLoader />', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  it('should not call fetch if origin is not set', async () => {
    vi.stubEnv('ORIGIN', undefined);
    vi.stubEnv('NODE_ENV', 'production');
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockData),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(await GasTrackerLoader());

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should prefetch data and render component', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockData),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(await GasTrackerLoader());

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
