import { useEffect, useLayoutEffect, useRef } from 'react';

function useInterval(callback: () => unknown, delay?: number) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay !== undefined) {
      const id = setInterval(() => savedCallback.current(), delay || 0);
      return () => clearInterval(id);
    }

    return undefined;
  }, [delay]);
}

export default useInterval;
