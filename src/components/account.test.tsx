import '@testing-library/jest-dom';
import { fireEvent, render, screen } from 'lib/test-utils';

import Account from '@/components/account';

describe('<Account />', () => {
  it('should be connect and disconnect', async () => {
    render(<Account />);

    const buttonConnect = screen.getByRole('button', {
      name: /mock/i,
    });

    fireEvent.click(buttonConnect);

    expect(
      await screen.findByText(/0x29072219f93D6893F9201Adfc31246169e785252/),
    ).toBeInTheDocument();

    expect(screen.getByText(/connected/)).toBeInTheDocument();

    const buttonDisconnect = screen.getByRole('button', {
      name: /Disconnect/i,
    });

    fireEvent.click(buttonDisconnect);

    expect(await screen.findByText('disconnected')).toBeInTheDocument();
  });
});
