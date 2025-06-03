import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';

import Header from '../header';

describe('<Header />', () => {
  it('should render', () => {
    render(<Header />);

    expect(screen.getByText('Stylish')).toBeInTheDocument();
    expect(screen.getByText('.DAPP')).toBeInTheDocument();
  });
});
