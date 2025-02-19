import '@testing-library/jest-dom/vitest';

import { render, screen } from '@/lib/test-utils';

import ErrorContent from '../error-content';

describe('<ErrorContent />', () => {
  it('should be render', () => {
    render(<ErrorContent>something</ErrorContent>);

    expect(screen.getByText(/something/)).toHaveClass(
      'overflow-x-auto flex flex-col gap-1 font-mono text-sm text-[#fa5252]',
    );
  });
});
