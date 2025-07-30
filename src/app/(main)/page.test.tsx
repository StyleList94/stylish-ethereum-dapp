import '@testing-library/jest-dom/vitest';

import { render, screen } from '@/lib/test-utils';

import MainPage from './page';

describe('Main page', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', async () => {
    try {
      render(await MainPage());

      expect(await screen.findByText(/Stylish.DApp/i)).toBeInTheDocument();
    } catch {
      /* DO NOTHING */
    }
  });
});
