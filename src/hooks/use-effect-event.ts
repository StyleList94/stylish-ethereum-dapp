import { useEffect, useRef } from 'react';

export default function useEffectEvent(fn: () => unknown) {
  const functionRef = useRef(fn);

  useEffect(() => {
    functionRef.current = fn;
  }, [fn]);

  return () => {
    functionRef.current();
  };
}
