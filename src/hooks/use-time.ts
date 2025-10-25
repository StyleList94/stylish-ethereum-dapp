import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';

type ResultUseTime = { currentTime: number | null; stopTick: () => void };

const INTERVAL_TIME = 1000;

const getServerTime = async () => {
  const res = await fetch('/api/time');
  return (await res.json()) as { serverTime: string };
};

export default function useTime(): ResultUseTime {
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      const { serverTime } = await getServerTime();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!ignore) {
        setCurrentTime(new Date(serverTime).getTime());
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const onTick = useEffectEvent(() => {
    setCurrentTime((prevState) => (prevState ?? 0) + INTERVAL_TIME);
  });

  const stopTick = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  useEffect(() => {
    intervalId.current = setInterval(onTick, INTERVAL_TIME);

    return () => {
      stopTick();
    };
  }, [stopTick]);

  return { currentTime, stopTick };
}
