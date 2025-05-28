import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';

import {
  Card,
  CardContent,
  CardContentItem,
  CardContentItemTitle,
  CardContentItemValue,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

describe('<Card />', () => {
  it('should render wrapper', () => {
    render(<Card>Card Section</Card>);

    const element = screen.getByText(/Card Section/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
    );
  });

  it('should render header', () => {
    render(<CardHeader>Card Title</CardHeader>);

    const element = screen.getByText(/Card Title/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass(
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
    );
  });

  it('should render title', () => {
    render(<CardTitle>Lovely</CardTitle>);

    const element = screen.getByText(/Lovely/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('leading-none font-semibold');
  });

  it('should render description', () => {
    render(<CardDescription>React</CardDescription>);

    const element = screen.getByText(/React/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('text-muted-foreground text-sm');
  });

  it('should render content', () => {
    render(<CardContent className="flex flex-col">Sexy Body</CardContent>);

    const element = screen.getByText(/Sexy Body/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('px-6');
  });

  it('should render content item', () => {
    render(<CardContentItem>X-rated Content</CardContentItem>);

    const element = screen.getByText(/X-rated Content/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('flex flex-col gap-1');
  });

  it('should render content item title', () => {
    render(<CardContentItemTitle>Command</CardContentItemTitle>);

    const element = screen.getByText(/Command/);
    expect(element.tagName).toMatch(/h3/i);
    expect(element).toHaveClass('font-medium text-sm');
  });

  it('should render content item value', () => {
    render(<CardContentItemValue>caffeinate</CardContentItemValue>);

    const element = screen.getByText(/caffeinate/);
    expect(element.tagName).toMatch(/p/i);
    expect(element).toHaveClass('font-mono text-base');
  });

  it('should render footer', () => {
    render(<CardFooter>Action</CardFooter>);

    const element = screen.getByText(/Action/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('flex items-center px-6 [.border-t]:pt-6');
  });
});
