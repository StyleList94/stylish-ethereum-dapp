import '@testing-library/jest-dom/vitest';

import { render, screen } from '@/lib/test-utils';

import GasTracker from '../gas-tracker';

const mockData = {
  lastBlock: '23003980',
  safeGasPrice: '10',
  averageGasPrice: '20',
  fastGasPrice: '30',
  status: 'OK',
};

describe('<GasTracker />', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => mockData,
    });
  });

  it('should be rendered', async () => {
    render(<GasTracker />);

    expect(
      await screen.findByText(
        (content, element) => element?.textContent === 'Average: 20 gwei',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('High: 30 gwei')).toBeInTheDocument();
    expect(screen.getByText('Low: 10 gwei')).toBeInTheDocument();
  });
});
