import { useEffect, useRef, useState } from 'react';

import useTime from '@/hooks/use-time';

type ResultUseLaunch = {
  remainTime: number | null;
  currentTime: number | null;
  launched: boolean;
};

/**
 * Countdown to Launch
 * @param launchDate - Target launch date(Date Value)
 */
export default function useLaunch(
  launchDate: number | string | Date,
): ResultUseLaunch {
  const launchTime = useRef(new Date(launchDate).getTime());
  const { currentTime, stopTick } = useTime();
  const [remainTime, setRemainTime] = useState<number | null>(null);

  const launched = typeof remainTime === 'number' && remainTime <= 0;

  useEffect(() => {
    if (launched) {
      stopTick();
    }
  }, [launched, stopTick]);

  useEffect(() => {
    if (currentTime) {
      setRemainTime(
        launchTime.current - currentTime >= 0
          ? launchTime.current - currentTime
          : 0,
      );
    }
  }, [currentTime]);

  return { remainTime, currentTime, launched };
}
