import '@testing-library/jest-dom/vitest';

import { render, screen } from '@/lib/test-utils';

import NotConnectedInfoBox from '../not-connected-info-box';

describe('<NotConnectedInfoBox />', () => {
  it('should render', () => {
    render(<NotConnectedInfoBox />);

    expect(screen.getByLabelText(/icon-unplug/)).toBeInTheDocument();
    expect(screen.getByText('Wallet not connected')).toBeInTheDocument();
  });
});
