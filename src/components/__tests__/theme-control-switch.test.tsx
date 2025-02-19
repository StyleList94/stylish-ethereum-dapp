import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from 'next-themes';

import type { Mock } from 'vitest';

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

  it('should be render', () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('today is sunny', () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const darkModeIcon = screen.getByLabelText(/icon-dark-mode/i);
    expect(darkModeIcon).toBeInTheDocument();
  });

  test('history is made at night', () => {
    (useTheme as Mock).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const lightModeIcon = screen.getByLabelText(/icon-light-mode/i);
    expect(lightModeIcon).toBeInTheDocument();
  });

  it('change dark mode', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'system',
      resolvedTheme: 'light',
      systemTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const switchButton = screen.getByRole('button');

    fireEvent.click(switchButton);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('turned off the switch', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      systemTheme: 'light',
      setTheme: mockSetTheme,
    });

    render(
      <ThemeProvider attribute="class">
        <ThemeControlSwitch />
      </ThemeProvider>,
    );

    const switchButton = screen.getByRole('button');

    fireEvent.click(switchButton);
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
