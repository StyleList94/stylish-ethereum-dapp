import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import MainContent from './main-container';

describe('<MainContent />', () => {
  it('should be rendered', () => {
    render(
      <MainContent>
        <p>Crazy Love</p>
      </MainContent>,
    );

    expect(screen.getByText(/Crazy Love/)).toBeInTheDocument();
  });
});
