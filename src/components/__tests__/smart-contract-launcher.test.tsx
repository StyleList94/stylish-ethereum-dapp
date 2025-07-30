import '@testing-library/jest-dom/vitest';

import type { Mock } from 'vitest';

import * as wagmi from 'wagmi';
import { erc20Abi } from 'viem';
import { userEvent } from '@testing-library/user-event';

import { fireEvent, render, screen } from '@/lib/test-utils';

import Account from '../account';
import SmartContractLauncher from '../smart-contract-launcher';

const txHash =
  '0xf866538a10ef1bd87cdf2d34c25e1793686af7f6222f7564c2038ebd837b0061';

vi.mock('wagmi', async () => {
  const originalModule = await vi.importActual<typeof wagmi>('wagmi');
  return {
    ...originalModule,
    useReadContract: vi.fn(),
    useWriteContract: vi.fn(),
  };
});

vi.mock('@/hooks/use-estimate-contract-gas', () => ({
  default: () => vi.fn().mockImplementation(() => Promise.resolve(100000n)),
}));

vi.mock('');

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

describe('<SmartContractLauncher />', () => {
  (wagmi.useReadContract as Mock).mockReturnValue({
    isLoading: false,
  });

  (wagmi.useWriteContract as Mock).mockReturnValue({
    isLoading: false,
  });

  it('should render', async () => {
    const user = userEvent.setup();

    render(<SmartContractLauncher />);

    expect(screen.getByText('Launcher')).toBeInTheDocument();
    expect(screen.getByText('Execute Smart Contract')).toBeInTheDocument();

    const inputFile: HTMLInputElement = screen.getByLabelText('Load ABI');

    expect(inputFile).toHaveAttribute('type', 'file');

    const abi = new File(['abi: {}'], 'token.json', {
      type: 'application/json',
    });

    await user.upload(inputFile, abi);

    expect(inputFile.files?.[0]).toBe(abi);
    expect(inputFile.files?.item(0)).toBe(abi);
    expect(inputFile.files).toHaveLength(1);
  });

  test('to read/write contract', async () => {
    (wagmi.useReadContract as Mock).mockReturnValue({
      data: 'WETH',
      isLoading: false,
      error: null,
    });

    const writeContractMock = vi.fn();
    (wagmi.useWriteContract as Mock).mockReturnValue({
      isLoading: false,
      writeContract: writeContractMock,
      isPending: false,
      data: txHash,
    });

    render(
      <>
        <Account />
        <SmartContractLauncher />
      </>,
    );

    const buttonConnect = screen.getByRole('button', {
      name: /mock/i,
    });

    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
    ).toBeInTheDocument();

    const buttonErc20 = screen.getByRole('button', { name: 'ERC20' });
    expect(screen.getByRole('button', { name: 'ERC721' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ERC4626' })).toBeInTheDocument();

    fireEvent.click(buttonErc20);

    const inputContractAddress = screen.getByLabelText('Contract Address');
    fireEvent.change(inputContractAddress, {
      target: { value: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9' },
    });

    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    const optionSymbol = await screen.findByText('symbol[0]');
    fireEvent.click(optionSymbol);

    expect(screen.getByText('view')).toBeInTheDocument();

    expect(screen.getByText('Result')).toBeInTheDocument();
    expect(screen.getByText('WETH')).toBeInTheDocument();

    fireEvent.click(trigger);
    const optionApprove = await screen.findByText('approve[2]');
    fireEvent.click(optionApprove);

    expect(screen.getByText('nonpayable')).toBeInTheDocument();
    const inputSpender = screen.getByLabelText(/spender/i);
    expect(screen.getByText(/^address$/)).toBeInTheDocument();
    const inputAmount = screen.getByLabelText(/amount/i);
    expect(screen.getByText(/uint256/i)).toBeInTheDocument();

    fireEvent.change(inputSpender, {
      target: { value: '0x29072219f93D6893F9201Adfc31246169e785252' },
    });
    fireEvent.change(inputAmount, {
      target: { value: '624000000000' },
    });

    const executeButton = screen.getByRole('button', { name: /execute/i });
    fireEvent.click(executeButton);

    await screen.findByText('Latest Tx Hash');
    expect(screen.getByText(txHash)).toBeInTheDocument();
    expect(writeContractMock).toHaveBeenCalledWith({
      abi: erc20Abi.filter((item) => item.type === 'function'),
      functionName: 'approve',
      address: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
      args: ['0x29072219f93D6893F9201Adfc31246169e785252', 624000000000n],
      gas: 120000n,
      value: 0n,
    });
  });
});
