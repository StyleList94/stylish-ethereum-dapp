import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';

type UseTimeOption = { intervalTime?: number };

type ResultUseTime = { currentTime: number | null; stopTick: () => void };

const DEFAULT_INTERVAL_TIME = 1000;

const getServerTime = async () => {
  const res = await fetch('/api/time');
  return (await res.json()) as { serverTime: string };
};

export default function useTime({
  intervalTime = DEFAULT_INTERVAL_TIME,
}: UseTimeOption = {}): ResultUseTime {
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
    setCurrentTime((prevState) => (prevState ?? 0) + intervalTime);
  });

  const stopTick = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  useEffect(() => {
    intervalId.current = setInterval(onTick, intervalTime);

    return stopTick;
  }, [intervalTime, stopTick]);

  return { currentTime, stopTick };
}
