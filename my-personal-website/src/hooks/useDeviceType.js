import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  phone: 480,
  tablet: 1024,
};

export default function useDeviceType() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let rafId;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const deviceType =
    width <= BREAKPOINTS.phone
      ? 'phone'
      : width <= BREAKPOINTS.tablet
        ? 'tablet'
        : 'desktop';

  return {
    deviceType,
    isMobile: deviceType === 'phone',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };
}
