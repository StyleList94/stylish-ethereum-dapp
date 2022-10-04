import { useCallback, useEffect, useRef, useState } from 'react';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import secondsToMinutes from 'date-fns/secondsToMinutes';
import secondsToHours from 'date-fns/secondsToHours';

export const useTimer = (launch) => {
  const [startTime, setStartTime] = useState(null);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const isMount = useRef(false);
  const count = useRef(null);
  const countdown = useRef(null);

  const getServerTime = useCallback(() => {
    let xmlHttp;
    try {
      xmlHttp = new window.XMLHttpRequest();
    } catch {
      try {
        xmlHttp = new window.ActiveXObject('Msxml2.XMLHTTP');
      } catch {
        xmlHttp = new window.ActiveXObject('Microsoft.XMLHTTP');
      }
    }
    xmlHttp.open('HEAD', window.location.href.toString(), false);
    xmlHttp.setRequestHeader('Content-Type', 'text/html');
    xmlHttp.send('');
    return xmlHttp.getResponseHeader('Date');
  }, []);

  const getCountdownMillisecond = useCallback(() => {
    const date = new Date(getServerTime());
    return differenceInMilliseconds(new Date(launch || getServerTime()), date);
  }, [launch, getServerTime]);

  const countdownInterval = useCallback(() => {
    if (count.current === null || !isMount.current) {
      count.current = getCountdownMillisecond();
      isMount.current = true;
    }
    count.current = count.current - 10;
    const countSec = parseInt(count.current / 1000, 10);

    setStartTime({
      hour: secondsToHours(countSec),
      min: secondsToMinutes(countSec) % 60,
      sec: countSec % 60,
    });
  }, [getCountdownMillisecond]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      clearInterval(countdown.current);
      countdown.current = null;

      isMount.current = false;
    } else {
      if (!countdown.current) {
        countdown.current = setInterval(countdownInterval, 10);
      }
    }
  }, [countdownInterval]);

  useEffect(() => {
    const countMs = getCountdownMillisecond();
    const diffSec = parseInt(countMs / 1000, 10);

    const hour = secondsToHours(diffSec);
    const min = secondsToMinutes(diffSec) % 60;
    const sec = diffSec % 60;

    setStartTime({
      hour,
      min,
      sec,
    });

    count.current = countMs;
    isMount.current = true;
  }, [getCountdownMillisecond]);

  useEffect(() => {
    countdown.current = setInterval(countdownInterval, 10);

    return () => {
      clearInterval(countdown.current);
      isMount.current = false;
    };
  }, [countdownInterval]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    if (+count.current <= 0) {
      setIsTimerDone(true);
      setStartTime(null);
      clearInterval(countdown.current);
    }
  }, [startTime]);

  return [startTime, isTimerDone];
};

export default useTimer;
