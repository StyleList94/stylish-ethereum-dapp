import '@testing-library/jest-dom/vitest';

import { render, screen } from '@/lib/test-utils';

import HeroSection from '../hero-section';

describe('<HeroSection />', () => {
  it('renders with correct content and styling', () => {
    render(<HeroSection />);

    // Badge with icon
    const badge = screen.getByText('Next Generation DApp');
    expect(badge).toBeInTheDocument();
    expect(badge.closest('div')).toHaveClass('inline-flex', 'items-center');

    // Main heading with responsive classes
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('Stylish');
    expect(heading.textContent).toContain('Ethereum');
    expect(heading.textContent).toContain('DApp');
    expect(heading).toHaveClass('text-5xl', 'md:text-6xl', 'lg:text-7xl');
    expect(heading).toHaveClass('font-bold', 'tracking-tight');

    // Subheading with responsive classes
    const subheading = screen.getByText('Build faster. Ship prettier.');
    expect(subheading).toHaveClass('text-lg', 'md:text-xl');
    expect(subheading.tagName).toBe('P');
  });
});
