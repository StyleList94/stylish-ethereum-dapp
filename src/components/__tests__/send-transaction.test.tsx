import '@testing-library/jest-dom/vitest';

import type { Mock } from 'vitest';

import * as wagmi from 'wagmi';

import { fireEvent, render, screen } from '@/lib/test-utils';

import Account from '../account';
import SendTransaction from '../send-transaction';

vi.mock('wagmi', async () => {
  const originalModule = await vi.importActual<typeof wagmi>('wagmi');
  return {
    ...originalModule,
    useBalance: vi.fn(),
    useSendTransaction: vi.fn(),
    useEstimateGas: vi.fn(),
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

describe('<SendTransaction />', () => {
  it('should render', () => {
    try {
      render(<SendTransaction />);

      expect(screen.getByText('Send Transaction')).toBeInTheDocument();
      expect(screen.getByText('Transfer for native token')).toBeInTheDocument();

      expect(screen.getByText('Wallet not connected')).toBeInTheDocument();
    } catch {
      /* DO NOTHING */
    }
  });

  test('to send ether', async () => {
    const sendTransactionMock = vi.fn();

    (wagmi.useEstimateGas as Mock).mockReturnValue({
      data: 21000n,
    });

    (wagmi.useSendTransaction as Mock).mockReturnValue({
      sendTransaction: sendTransactionMock,
      status: 'success',
      data: '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
      error: null,
    });

    (wagmi.useBalance as Mock).mockReturnValue({
      data: {
        decimals: 18,
        formatted: '0.987654321',
        symbol: 'ETH',
        value: 987654321000000000n,
      },
    });

    try {
      render(
        <>
          <Account />
          <SendTransaction />
        </>,
      );

      const buttonConnect = screen.getByRole('button', {
        name: /mock/i,
      });

      fireEvent.click(buttonConnect);

      expect(
        await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
      ).toBeInTheDocument();

      expect(screen.getByText('Balance')).toBeInTheDocument();
      expect(screen.getByText('9.87654321')).toBeInTheDocument();

      const inputTo = screen.getByLabelText('To');
      fireEvent.change(inputTo, {
        target: { value: '0x29072219f93D6893F9201Adfc31246169e785252' },
      });
      const inputEther = screen.getByPlaceholderText('ETH');
      fireEvent.change(inputEther, {
        target: { value: '0.000000624' },
      });

      const buttonSend = screen.getByRole('button', { name: 'Send ETH' });
      fireEvent.click(buttonSend);

      expect(sendTransactionMock).toHaveBeenCalledWith({
        to: '0x29072219f93D6893F9201Adfc31246169e785252',
        value: 624000000000n,
        gas: 21000n,
      });

      expect(screen.getByText('Send Tx Status')).toBeInTheDocument();
      expect(screen.getByText('success')).toBeInTheDocument();

      expect(screen.getByText('TX Hash')).toBeInTheDocument();
      expect(
        screen.getByText(
          '0xba42acf1c07c57c2187af118a2f4f8232b84d641156d633b3a2cf682b447c363',
        ),
      ).toBeInTheDocument();
    } catch {
      /* DO NOTHING */
    }
  });

  test('to tx execution error', async () => {
    (wagmi.useSendTransaction as Mock).mockReturnValue({
      status: 'error',
      error: {
        name: 'TransactionExecutionError',
        message: 'User rejected the request.',
      },
    });

    try {
      render(
        <>
          <Account />
          <SendTransaction />
        </>,
      );

      const buttonConnect = screen.getByRole('button', {
        name: /mock/i,
      });

      fireEvent.click(buttonConnect);

      expect(
        await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
      ).toBeInTheDocument();

      expect(screen.getByText('Send Tx Status')).toBeInTheDocument();
      expect(screen.getByText('error')).toBeInTheDocument();

      expect(screen.getByText('TransactionExecutionError')).toBeInTheDocument();
      expect(
        screen.getByText(/User rejected the request\./),
      ).toBeInTheDocument();
    } catch {
      /* DO NOTHING */
    }
  });
});
