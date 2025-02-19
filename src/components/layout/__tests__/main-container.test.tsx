import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import MainContainer from '../main-container';

describe('<MainContainer />', () => {
  it('should be rendered', () => {
    render(
      <MainContainer>
        <p>Crazy Love</p>
      </MainContainer>,
    );

    expect(screen.getByText(/Crazy Love/)).toBeInTheDocument();
  });
});
