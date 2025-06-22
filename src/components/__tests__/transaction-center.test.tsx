import type { Mock } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@/lib/test-utils';
import usePendingTransaction from '@/hooks/use-pending-transaction';

import Account from '../account';
import TransactionCenter from '../transaction-center';

vi.mock('@/hooks/use-pending-transaction', () => ({
  default: vi.fn(),
}));

const txHash =
  '0x47085a68363365a56902ec7619f6054e6b044a87dd2813c1c0e1377279c423db';

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => ({ message: 'fetched!' }),
  });
});

describe('<TransactionCenter />', () => {
  (usePendingTransaction as Mock).mockReturnValue({
    pendingTxCount: 0,
    status: 'pending',
  });

  it('should render', () => {
    render(<TransactionCenter />);

    expect(screen.getByText('Transaction Center')).toBeInTheDocument();
    expect(screen.getByText('Live transaction status')).toBeInTheDocument();

    expect(screen.getByText('Wallet not connected')).toBeInTheDocument();
  });

  it('shoud render when wallet is connected', async () => {
    render(
      <>
        <Account />
        <TransactionCenter />
      </>,
    );

    const buttonConnect = screen.getByRole('button', {
      name: /mock/i,
    });

    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
    ).toBeInTheDocument();

    expect(screen.getByText('Wait Tx Status')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();

    expect(screen.getByText('Pending Tx Count')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('to wait tx', async () => {
    (usePendingTransaction as Mock).mockReturnValue({
      pendingTxCount: 1,
      pendingTxHash: txHash,
      status: 'pending',
    });

    render(
      <>
        <Account />
        <TransactionCenter />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }));
    const buttonConnect = await screen.findByRole('button', {
      name: /mock/i,
    });

    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
    ).toBeInTheDocument();

    expect(screen.getByText('Pending Tx Count')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('Pending Tx Hash')).toBeInTheDocument();
    expect(screen.getByText(txHash)).toBeInTheDocument();
  });

  test('to complete transaction', async () => {
    (usePendingTransaction as Mock).mockReturnValue({
      pendingTxCount: 0,
      pendingTxHash: txHash,
      status: 'success',
      latestTxReceipt: { hash: txHash, blockNumber: 8416945 },
    });

    render(
      <>
        <Account />
        <TransactionCenter />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }));
    const buttonConnect = await screen.findByRole('button', {
      name: /mock/i,
    });

    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
    ).toBeInTheDocument();

    expect(screen.getByText('Pending Tx Count')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();

    expect(screen.getByText('Latest Tx Receipt')).toBeInTheDocument();
    expect(
      screen.getByText(
        JSON.stringify({
          hash: txHash,
          blockNumber: 8416945,
        }),
      ),
    ).toBeInTheDocument();
  });
});
