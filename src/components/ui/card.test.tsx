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
  it('should be render wrapper', () => {
    render(<Card>Card Section</Card>);

    const element = screen.getByText(/Card Section/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass(
      'rounded-xl border bg-card text-card-foreground shadow',
    );
  });

  it('should be render header', () => {
    render(<CardHeader>Card Title</CardHeader>);

    const element = screen.getByText(/Card Title/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('flex flex-col space-y-1.5 p-6');
  });

  it('should be render title', () => {
    render(<CardTitle>Lovely</CardTitle>);

    const element = screen.getByText(/Lovely/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('font-semibold leading-none tracking-tight');
  });

  it('should be render description', () => {
    render(<CardDescription>React</CardDescription>);

    const element = screen.getByText(/React/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('text-sm text-muted-foreground');
  });

  it('should be render content', () => {
    render(<CardContent className="flex flex-col">Sexy Body</CardContent>);

    const element = screen.getByText(/Sexy Body/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('p-6 pt-0 flex flex-col');
  });

  it('should be render content item', () => {
    render(<CardContentItem>X-rated Content</CardContentItem>);

    const element = screen.getByText(/X-rated Content/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('flex flex-col gap-0.5');
  });

  it('should be render content item title', () => {
    render(<CardContentItemTitle>Command</CardContentItemTitle>);

    const element = screen.getByText(/Command/);
    expect(element.tagName).toMatch(/h3/i);
    expect(element).toHaveClass('font-medium');
  });

  it('should be render content item value', () => {
    render(<CardContentItemValue>caffeinate</CardContentItemValue>);

    const element = screen.getByText(/caffeinate/);
    expect(element.tagName).toMatch(/p/i);
    expect(element).toHaveClass('overflow-x-auto font-mono text-lg');
  });

  it('should be render footer', () => {
    render(<CardFooter>Action</CardFooter>);

    const element = screen.getByText(/Action/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('flex items-center p-6 pt-0');
  });
});
