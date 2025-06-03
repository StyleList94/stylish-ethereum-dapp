import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';

import Footer from '../footer';

describe('<Footer />', () => {
  it('should render', () => {
    render(<Footer />);

    expect(screen.getByLabelText(/GitHub/)).toHaveAttribute(
      'href',
      'https://github.com/StyleList94/stylish-ethereum-dapp.git',
    );

    expect(screen.getByText(/© 2025./)).toBeInTheDocument();
    expect(screen.getByText(/StyleList94/)).toHaveAttribute(
      'href',
      'https://github.com/StyleList94',
    );
  });
});
