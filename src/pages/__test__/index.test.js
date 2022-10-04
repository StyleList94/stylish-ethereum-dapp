import { render, screen } from '@testing-library/react';

import IndexPage from '..';

describe('Index Page', () => {
  it('should be render', () => {
    render(<IndexPage />);

    const heading = screen.getByRole('heading', {
      name: /Stylish Ethereum DApp/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
