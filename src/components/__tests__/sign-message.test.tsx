import type { Mock } from 'vitest';

import '@testing-library/jest-dom/vitest';
import * as wagmi from 'wagmi';

import { fireEvent, render, screen, waitFor } from '@/lib/test-utils';

import Account from '../account';
import SignMessage from '../sign-message';

vi.mock('wagmi', async () => {
  const originalModule = await vi.importActual<typeof wagmi>('wagmi');
  return {
    ...originalModule,
    useSignMessage: vi.fn(),
  };
});

const signMessageMock = vi.fn();
const message = 'cookie and cream';
const data =
  '0x5bfe6b411e67287eb49ad7fdb8ab8e41820bebab321cb1e7b04131197b1208b17d094445fc6442ac8113c1b730c219573907e29b964a02f12e03e0a09d8da8f71b';

describe('<SignMessage />', () => {
  it('should render', () => {
    (wagmi.useSignMessage as Mock).mockReturnValue({
      signMessage: signMessageMock,
      status: 'idle',
    });

    render(<SignMessage />);

    expect(screen.getAllByText('Signature')[0]).toBeInTheDocument();
    expect(screen.getByText('Sign/Recover Message')).toBeInTheDocument();

    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Signature')).toBeInTheDocument();

    expect(screen.getByText('Cannot Signing')).toBeInTheDocument();
    expect(screen.getByText('Wallet not connected')).toBeInTheDocument();

    expect(screen.getByText('Sign message status')).toBeInTheDocument();
    expect(screen.getByText('idle')).toBeInTheDocument();
  });

  test('to sign message', async () => {
    (wagmi.useSignMessage as Mock).mockReturnValue({
      signMessage: signMessageMock,
      status: 'success',
      isSuccess: true,
      data,
    });

    render(
      <>
        <Account />
        <SignMessage />
      </>,
    );

    const buttonConnect = screen.getByRole('button', {
      name: /mock/i,
    });
    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
    ).toBeInTheDocument();

    const inputMessage = screen.getByPlaceholderText('Type message here.');

    fireEvent.change(inputMessage, {
      target: {
        value: message,
      },
    });

    const buttonSign = screen.getByRole('button', { name: /Sign Message/ });

    fireEvent.click(buttonSign);

    await waitFor(() => {
      expect(signMessageMock).toHaveBeenCalledWith({
        message,
      });
    });

    expect(screen.getByText('success')).toBeInTheDocument();
    expect(screen.getAllByText('Signature')[2]).toBeInTheDocument();
    expect(screen.getByText(data)).toBeInTheDocument();
  });

  test('to recovery signature', async () => {
    render(<SignMessage />);

    const inputMessage = screen.getByPlaceholderText('Type message here.');
    const inputSign = screen.getByLabelText('Signature');

    fireEvent.change(inputMessage, { target: { value: message } });
    fireEvent.change(inputSign, { target: { value: data } });

    const buttonRecovery = screen.getByRole('button', { name: /Recovery/ });

    fireEvent.click(buttonRecovery);

    expect(
      await screen.findByText('0x29072219f93D6893F9201Adfc31246169e785252'),
    ).toBeInTheDocument();
  });
});
