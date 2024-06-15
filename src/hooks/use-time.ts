import { useEffect, useState } from 'react';
import useEffectEvent from 'hooks/use-effect-event';

type UseTimerResult = number | null;

const INTERVAL_TIME = 100;

const getServerTime = async () => {
  const res = await fetch('/api/time');
  return (await res.json()) as { serverTime: string };
};

export default function useTime(): UseTimerResult {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      const { serverTime } = await getServerTime();
      if (!ignore) {
        setCurrentTime(new Date(serverTime).getTime());
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const onTick = useEffectEvent(() => {
    setCurrentTime((prevState) => (prevState || 0) + INTERVAL_TIME);
  });

  useEffect(() => {
    const intervalID = setInterval(onTick, INTERVAL_TIME);

    return () => {
      clearInterval(intervalID);
    };
  }, [onTick]);

  return currentTime;
}
