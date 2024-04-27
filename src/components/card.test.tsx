import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Card from '@/components/card';

describe('<Card />', () => {
  it('should be render section', () => {
    render(<Card.Section>Card Section</Card.Section>);

    const element = screen.getByText(/Card Section/);
    expect(element.tagName).toMatch(/section/i);
    expect(element).toHaveClass(
      'flex flex-col w-full max-w-[375px] p-4 border border-solid border-[#e9ecef] rounded-xl shadow-md',
    );
  });

  it('should be render title', () => {
    render(<Card.Title>Card Title</Card.Title>);

    const element = screen.getByText(/Card Title/);
    expect(element.tagName).toMatch(/h2/i);
    expect(element).toHaveClass('mb-4 text-xl text-center');
  });

  it('should be render content list', () => {
    render(<Card.ContentList>Card Content List</Card.ContentList>);

    const element = screen.getByText(/Card Content List/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('flex flex-col gap-5 py-4');
  });

  it('should be render content item', () => {
    render(<Card.ContentItem>Card Content Item</Card.ContentItem>);

    const element = screen.getByText(/Card Content Item/);
    expect(element.tagName).toMatch(/section/i);
    expect(element).toHaveClass('flex flex-col gap-1');
  });

  it('should be render content item title', () => {
    render(<Card.ItemTitle>Card Item Title</Card.ItemTitle>);

    const element = screen.getByText(/Card Item Title/);
    expect(element.tagName).toMatch(/h3/i);
    expect(element).toHaveClass('font-normal text-[#adb5bd]');
  });

  it('should be render content item value', () => {
    render(<Card.ItemValue>Card Item Value</Card.ItemValue>);

    const element = screen.getByText(/Card Item Value/);
    expect(element.tagName).toMatch(/p/i);
    expect(element).toHaveClass('overflow-x-auto font-mono text-xl');
  });

  it('should be render action group', () => {
    render(<Card.ActionGroup>Card Action Group</Card.ActionGroup>);

    const element = screen.getByText(/Card Action Group/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass(
      'flex flex-col gap-4 p-4 border border-solid border-[#f1f3f5] rounded-xl',
    );
  });

  it('should be render result box', () => {
    render(<Card.ResultBox>Card Result Box</Card.ResultBox>);

    const element = screen.getByText(/Card Result Box/);
    expect(element.tagName).toMatch(/div/i);
    expect(element).toHaveClass('flex flex-col gap-1');
  });

  it('should be render result value', () => {
    render(<Card.ResultValue>Card Result Value</Card.ResultValue>);

    const element = screen.getByText(/Card Result Value/);
    expect(element.tagName).toMatch(/p/i);
    expect(element).toHaveClass('overflow-x-auto font-mono text-sm');
  });
});
