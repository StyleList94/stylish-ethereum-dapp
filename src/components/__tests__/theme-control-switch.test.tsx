import '@testing-library/jest-dom/vitest';

import type { Mock } from 'vitest';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from 'next-themes';

import ThemeControlSwitch from '../theme-control-switch';

vi.mock('next-themes', async () => {
  const actualModule = await vi.importActual('next-themes');
  return {
    ...actualModule,
    useTheme: vi.fn(),
  };
});

describe('<ThemeControlSwitch />', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const mockSetTheme = vi.fn();

  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it('should render all theme toggle buttons', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText(/icon-light-mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/icon-system-mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/icon-dark-mode/i)).toBeInTheDocument();
  });

  test('today is sunny', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const radios = screen.getAllByRole('radio');
    const lightButton = radios.find((radio) =>
      within(radio).queryByLabelText(/icon-light-mode/i),
    );

    expect(lightButton).toHaveAttribute('data-state', 'on');
  });

  test('history is made at night', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const radios = screen.getAllByRole('radio');
    const darkButton = radios.find((radio) =>
      within(radio).queryByLabelText(/icon-dark-mode/i),
    );

    expect(darkButton).toHaveAttribute('data-state', 'on');
  });

  test('what the system wants', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const radios = screen.getAllByRole('radio');
    const darkButton = radios.find((radio) =>
      within(radio).queryByLabelText(/icon-system-mode/i),
    );

    expect(darkButton).toHaveAttribute('data-state', 'on');
  });

  it('change to dark mode', async () => {
    const user = userEvent.setup();

    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const radios = screen.getAllByRole('radio');
    const darkButton = radios.find((radio) =>
      within(radio).queryByLabelText(/icon-dark-mode/i),
    );

    if (darkButton) {
      await user.click(darkButton);
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    }
  });

  it('change to light mode', async () => {
    const user = userEvent.setup();

    (useTheme as Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const radios = screen.getAllByRole('radio');
    const lightButton = radios.find((radio) =>
      within(radio).queryByLabelText(/icon-light-mode/i),
    );

    if (lightButton) {
      await user.click(lightButton);
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    }
  });

  it('change to system theme', async () => {
    const user = userEvent.setup();

    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const radios = screen.getAllByRole('radio');
    const systemButton = radios.find((radio) =>
      within(radio).queryByLabelText(/icon-system-mode/i),
    );

    if (systemButton) {
      await user.click(systemButton);
      expect(mockSetTheme).toHaveBeenCalledWith('system');
    }
  });
});
