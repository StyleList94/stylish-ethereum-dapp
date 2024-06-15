import { useCallback, useInsertionEffect, useRef } from 'react';

export default function useEffectEvent(fn: (...args: never[]) => unknown) {
  const functionRef = useRef(fn);

  useInsertionEffect(() => {
    functionRef.current = fn;
  }, [fn]);

  return useCallback((...args: never[]) => functionRef.current(...args), []);
}
