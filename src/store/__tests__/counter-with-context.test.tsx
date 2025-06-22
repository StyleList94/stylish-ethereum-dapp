import '@testing-library/jest-dom/vitest';

import { fireEvent, renderWithStore, screen } from '@/lib/test-utils';

import useRootStore from '@/store/hooks';
import { createRootStore } from '@/store';

const CounterWithContext = () => {
  const { count, incrementCount, decrementCount } = useRootStore(
    (state) => state,
  );

  return (
    <div>
      <button type="button" onClick={decrementCount}>
        decrement
      </button>
      <p>{count}</p>
      <button type="button" onClick={incrementCount}>
        increment
      </button>
    </div>
  );
};

describe('Counter Store', () => {
  it('should render with initial state of 0', () => {
    const store = createRootStore();
    renderWithStore(<CounterWithContext />, store);

    expect(store.getState().count).toBe(0);
  });

  it('should increase count by clicking a button', () => {
    const store = createRootStore();
    renderWithStore(<CounterWithContext />, store);

    expect(store.getState().count).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    expect(store.getState().count).toBe(1);
  });

  it('should decrease count by clicking a button', () => {
    const store = createRootStore();
    renderWithStore(<CounterWithContext />, store);

    expect(store.getState().count).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: /decrement/i }));
    expect(store.getState().count).toBe(-1);
  });
});
