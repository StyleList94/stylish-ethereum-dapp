import { useEffect, useRef, useState } from 'react';
import useEffectEvent from '@/hooks/use-effect-event';

type UseLaunchResult = {
  remainTime: number | null;
  currentTime: number | null;
  isLaunch: boolean;
};

const INTERVAL_TIME = 100;

const getServerTime = async () => {
  const res = await fetch('/api/time');
  return (await res.json()) as { serverTime: string };
};

export default function useLaunch(launchDate: string): UseLaunchResult {
  const launchTime = useRef(new Date(launchDate).getTime());
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [remainTime, setRemainTime] = useState<number | null>(null);
  const countdownIntervalID = useRef<number | null>(null);

  const isLaunch = typeof remainTime === 'number' && remainTime <= 0;

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
    countdownIntervalID.current = intervalID;

    return () => {
      clearInterval(intervalID);
    };
  }, [onTick]);

  useEffect(() => {
    if (isLaunch && countdownIntervalID.current) {
      clearInterval(countdownIntervalID.current);
    }
  }, [isLaunch]);

  useEffect(() => {
    if (currentTime) {
      setRemainTime(
        launchTime.current - currentTime >= 0
          ? launchTime.current - currentTime
          : 0,
      );
    }
  }, [currentTime]);

  return { remainTime, currentTime, isLaunch };
}
