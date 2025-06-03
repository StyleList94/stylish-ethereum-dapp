import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';

import MainContainer from '../main-container';

describe('<MainContainer />', () => {
  it('should render', () => {
    render(
      <MainContainer>
        <p>Crazy Love</p>
      </MainContainer>,
    );

    expect(screen.getByText(/Crazy Love/)).toBeInTheDocument();
  });
});
