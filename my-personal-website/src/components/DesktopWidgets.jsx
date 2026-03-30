import React from 'react';
import useTimeTheme from '../hooks/useTimeTheme';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function DesktopWidgets() {
  const { now, period, isNight, greeting } = useTimeTheme();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const yearStr = now.getFullYear();

  const PeriodIcon = isNight ? DarkModeIcon : (period === 'dawn' || period === 'dusk') ? WbTwilightIcon : WbSunnyIcon;

  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);

  return (
    <div className="desktop-widgets">
      {/* Main clock card */}
      <div className="widget-clock-card">
        <div className="widget-clock-time">
          <span className="clock-digit">{hours}</span>
          <span className="clock-separator">:</span>
          <span className="clock-digit">{minutes}</span>
          <span className="clock-seconds">{seconds}</span>
        </div>
        <div className="widget-clock-date">
          <CalendarTodayIcon sx={{ fontSize: 14 }} />
          <span>{dateStr}, {yearStr}</span>
        </div>
      </div>

      {/* Greeting + period indicator */}
      <div className="widget-greeting-card">
        <div className="widget-greeting-icon">
          <PeriodIcon sx={{ fontSize: 28 }} />
        </div>
        <div className="widget-greeting-text">
          <span className="widget-greeting-hello">{greeting}</span>
          <span className="widget-greeting-sub">
            {period === 'dawn' ? 'A new day begins' : period === 'dusk' ? 'Sunset vibes' : ''}
          </span>
        </div>
      </div>

      {/* Minimal system stats */}
      <div className="widget-stats-card">
        <div className="widget-stat-row">
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <span>Timezone</span>
          <span className="widget-stat-value">{Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace('_', ' ')}</span>
        </div>
        <div className="widget-stat-row">
          <CalendarTodayIcon sx={{ fontSize: 14 }} />
          <span>Day of year</span>
          <span className="widget-stat-value">{dayOfYear} / 365</span>
        </div>
      </div>
    </div>
  );
}

export default DesktopWidgets;
