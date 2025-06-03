import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@/lib/test-utils';

import Network from '../network';
import Account from '../account';

beforeEach(() => {});

describe('<Network />', () => {
  it('should not connect wallet', () => {
    render(<Network />);

    expect(screen.getByText('Network')).toBeInTheDocument();
    expect(screen.getByText('Chain info from EVM wallet')).toBeInTheDocument();

    expect(screen.getByText(/wallet not connected/i)).toBeInTheDocument();
  });
  it('should detect and switching network', async () => {
    render(
      <>
        <Account />
        <Network />
      </>,
    );

    const buttonConnect = screen.getByRole('button', {
      name: /mock/i,
    });

    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
    ).toBeInTheDocument();

    expect(screen.getByText('Chain Id')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ethereum/ }),
    ).toBeInTheDocument();

    const buttonSwitchSepolia = screen.getByRole('button', { name: /Sepolia/ });

    fireEvent.click(buttonSwitchSepolia);

    expect(await screen.findByText(/11155111/)).toBeInTheDocument();
  });
});
