import '@testing-library/jest-dom';

import ErrorContent from '@/components/error-content';

import { render, screen } from '../lib/test-utils';

describe('<ErrorContent />', () => {
  it('should be render', () => {
    render(<ErrorContent>something</ErrorContent>);

    expect(screen.getByText(/something/)).toHaveClass(
      'overflow-x-auto flex flex-col gap-1 font-mono text-sm text-[#fa5252]',
    );
  });
});
