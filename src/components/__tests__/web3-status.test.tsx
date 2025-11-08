import '@testing-library/jest-dom/vitest';

import type { Mock } from 'vitest';

import * as wagmi from 'wagmi';

import { fireEvent, render, screen } from '@/lib/test-utils';
import { shortenAddress } from '@/lib/utils';

import Web3Status from '../web3-status';

vi.mock('wagmi', async () => {
  const originalModule = await vi.importActual<typeof wagmi>('wagmi');
  return {
    ...originalModule,
    useBalance: vi.fn(),
  };
});

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => ({ message: 'fetched!' }),
    }),
  );
});

describe('<Web3Status />', () => {
  it('should render when wallet is not connected', async () => {
    (wagmi.useBalance as Mock).mockReturnValue({
      data: {
        decimals: 18,
        formatted: '0.987654321',
        symbol: 'ETH',
        value: 987654321000000000n,
      },
    });

    render(<Web3Status />);

    const buttonConnect = screen.getByRole('button', {
      name: 'Connect Wallet',
    });

    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(
        shortenAddress('0x29072219f93D6893F9201Adfc31246169e785252'),
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('0.9877 ETH')).toBeInTheDocument();
  });
});
