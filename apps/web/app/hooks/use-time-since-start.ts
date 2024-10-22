import { useState, useEffect } from "react";

export function useTimeSinceStart(startTime: number | null): number {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(-1);

  useEffect(() => {
    if (startTime === null) {
      setSecondsElapsed(-1);
      return;
    }

    setSecondsElapsed(Math.floor((Date.now() - startTime) / 1000));

    const interval = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return secondsElapsed;
}
