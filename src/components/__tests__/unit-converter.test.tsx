import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';

import UnitConverter from '../unit-converter';

describe('<UnitConverter />', () => {
  it('should render', () => {
    render(<UnitConverter />);

    expect(screen.getByText('Unit Converter')).toBeInTheDocument();
    expect(screen.getByText('Ether to Wei')).toBeInTheDocument();

    expect(screen.getByLabelText('Ether')).toBeInTheDocument();
    expect(screen.getByLabelText('Gwei')).toBeInTheDocument();
    expect(screen.getByLabelText('Wei')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Ether')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Gwei')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Wei')).toBeInTheDocument();
  });

  it('converts ether to wei, wei to ether', () => {
    render(<UnitConverter />);

    const inputEther = screen.getByPlaceholderText('Ether');
    const inputGwei = screen.getByPlaceholderText('Gwei');
    const inputWei = screen.getByPlaceholderText('Wei');

    fireEvent.change(inputEther, { target: { value: '1' } });

    expect(inputGwei).toHaveAttribute('value', '1000000000');
    expect(inputWei).toHaveAttribute('value', '1000000000000000000');

    fireEvent.change(inputGwei, { target: { value: '20' } });
    expect(inputEther).toHaveAttribute('value', '0.00000002');
    expect(inputWei).toHaveAttribute('value', '20000000000');

    fireEvent.change(inputWei, { target: { value: '3' } });
    expect(inputEther).toHaveAttribute('value', '0.000000000000000003');
    expect(inputGwei).toHaveAttribute('value', '0.000000003');
  });

  it('handles exception', () => {
    render(<UnitConverter />);

    const inputEther = screen.getByPlaceholderText('Ether');
    const inputGwei = screen.getByPlaceholderText('Gwei');
    const inputWei = screen.getByPlaceholderText('Wei');

    fireEvent.change(inputEther, { target: { value: '1.23' } });
    expect(inputGwei).toHaveAttribute('value', '1230000000');
    expect(inputWei).toHaveAttribute('value', '1230000000000000000');

    fireEvent.change(inputEther, { target: { value: '' } });
    expect(inputGwei).toHaveAttribute('value', '0');
    expect(inputWei).toHaveAttribute('value', '0');

    fireEvent.change(inputEther, { target: { value: '-12' } });
    expect(inputEther).toHaveAttribute('value', '');

    fireEvent.change(inputEther, { target: { value: 'love_cream' } });
    expect(inputEther).toHaveAttribute('value', '');
  });
});
