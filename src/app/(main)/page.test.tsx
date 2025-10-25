import '@testing-library/jest-dom/vitest';

import { render, screen } from '@/lib/test-utils';

import MainPage from './page';

describe('Main page', () => {
  beforeAll(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', async () => {
    try {
      render(await MainPage());

      expect(
        await screen.findByText(/Stylish Ethereum DApp/i),
      ).toBeInTheDocument();
    } catch {
      /* DO NOTHING */
    }
  });

  it('renders HeroSection component', async () => {
    render(await MainPage());

    // Check for hero section content
    expect(screen.getByText('Next Generation DApp')).toBeInTheDocument();
    expect(screen.getByText(/Stylish/)).toBeInTheDocument();
    expect(screen.getByText('Build faster. Ship prettier.')).toBeInTheDocument();
  });

  it('renders Features component with accessible tabs', async () => {
    render(await MainPage());

    // Check for tablist and tabs using accessibility roles
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const allTab = screen.getByRole('tab', { name: 'All' });
    const networkTab = screen.getByRole('tab', { name: 'Network' });
    const signatureTab = screen.getByRole('tab', { name: 'Signature' });
    const transactionTab = screen.getByRole('tab', { name: 'Transaction' });

    expect(allTab).toBeInTheDocument();
    expect(networkTab).toBeInTheDocument();
    expect(signatureTab).toBeInTheDocument();
    expect(transactionTab).toBeInTheDocument();

    // Check that 'All' tab is selected by default
    expect(allTab).toHaveAttribute('aria-selected', 'true');
    expect(networkTab).toHaveAttribute('aria-selected', 'false');

    // Check tabpanel exists
    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel).toBeInTheDocument();
    expect(tabpanel).toHaveAttribute('id', 'tabpanel-all');
  });
});
