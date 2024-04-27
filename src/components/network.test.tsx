import '@testing-library/jest-dom';
import { fireEvent, render, screen } from 'lib/test-utils';

import Network from '@/components/network';
import Account from '@/components/account';

beforeEach(() => {});

describe('<Network />', () => {
  it('should be detect and switching network', async () => {
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

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ethereum/ }),
    ).toBeInTheDocument();

    const buttonSwitchSepolia = screen.getByRole('button', { name: /Sepolia/ });

    fireEvent.click(buttonSwitchSepolia);

    expect(await screen.findByText(/11155111/)).toBeInTheDocument();
  });
});
