import '@testing-library/jest-dom/vitest';

import { render, screen } from '@/lib/test-utils';

import ErrorContent from '../error-content';

describe('<ErrorContent />', () => {
  it('should render', () => {
    render(<ErrorContent>something</ErrorContent>);

    expect(screen.getByText(/something/)).toHaveStyle({
      color: 'rgb(239 68 68 / var(--tw-text-opacity, 1))',
    });
  });
});
