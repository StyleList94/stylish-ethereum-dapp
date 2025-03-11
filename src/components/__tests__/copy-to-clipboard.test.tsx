import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import CopyToClipboard from '../copy-to-clipboard';

describe('<CopyToClipboard />', () => {
  it('should be render', async () => {
    render(<CopyToClipboard copyText="Love" />);

    const button = screen.getByRole('button', { name: 'copy-to-clipboard' });

    expect(button).toBeInTheDocument();

    await userEvent.hover(button);

    expect(
      await screen.findByText('Copy', {
        selector: 'div[data-state="delayed-open"] >',
      }),
    ).toBeInTheDocument();
  });

  it('should be copied item', async () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined), // 기본적으로 resolved promise 반환
        },
      },
    });

    const {
      clipboard: { writeText },
    } = navigator;

    render(<CopyToClipboard copyText="Love" />);

    const button = screen.getByRole('button', { name: 'copy-to-clipboard' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('Love');
    });

    await userEvent.hover(button);

    expect(
      await screen.findByText('Copied!', {
        selector: 'div[data-state="delayed-open"] >',
      }),
    ).toBeInTheDocument();
  });
});
