import { useState, useEffect } from 'react';

// Detect if the device has touch capability (actual mobile/tablet hardware)
function isTouchDevice() {
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0)
  );
}

// Check user agent for mobile/tablet patterns
function detectFromUserAgent() {
  const ua = navigator.userAgent || '';
  const isMobileUA = /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua);
  const isTabletUA = /iPad|Android(?!.*Mobile)|tablet/i.test(ua);
  return { isMobileUA, isTabletUA };
}

// Breakpoints differ based on whether it's a real touch device or just a resized browser
const TOUCH_BREAKPOINTS = {
  phone: 480,
  tablet: 1024,
};

// Non-touch devices (desktop browsers being resized) stay in desktop mode much longer
const DESKTOP_BREAKPOINTS = {
  phone: 360,    // only switch to phone at very narrow widths
  tablet: 680,   // only switch to tablet at quite narrow widths
};

export default function useDeviceType() {
  const [width, setWidth] = useState(window.innerWidth);
  const [isTouch] = useState(() => isTouchDevice());
  const [uaHints] = useState(() => detectFromUserAgent());

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

  let deviceType;

  if (isTouch || uaHints.isMobileUA || uaHints.isTabletUA) {
    // Real touch device — use standard mobile breakpoints
    // But also respect UA hints: if UA says mobile, treat as phone even at wider widths
    if (uaHints.isMobileUA || width <= TOUCH_BREAKPOINTS.phone) {
      deviceType = 'phone';
    } else if (uaHints.isTabletUA || width <= TOUCH_BREAKPOINTS.tablet) {
      deviceType = 'tablet';
    } else {
      deviceType = 'desktop';
    }
  } else {
    // Non-touch device (desktop browser) — keep desktop layout much longer when resizing
    if (width <= DESKTOP_BREAKPOINTS.phone) {
      deviceType = 'phone';
    } else if (width <= DESKTOP_BREAKPOINTS.tablet) {
      deviceType = 'tablet';
    } else {
      deviceType = 'desktop';
    }
  }

  return {
    deviceType,
    isMobile: deviceType === 'phone',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isTouch,
  };
}
