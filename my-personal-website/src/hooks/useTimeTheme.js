import { useState, useEffect, useMemo } from 'react';

/**
 * Returns time-of-day theme info and a live clock.
 * Day: 6 AM – 8 PM, Night: 8 PM – 6 AM
 */
export default function useTimeTheme() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = now.getHours();
  const isNight = hour >= 20 || hour < 6;
  const isDawn = hour >= 6 && hour < 8;
  const isDusk = hour >= 18 && hour < 20;

  const period = isNight ? 'night' : isDawn ? 'dawn' : isDusk ? 'dusk' : 'day';

  const greeting = useMemo(() => {
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  }, [hour]);

  return { now, period, isNight: isNight || isDusk, greeting };
}
