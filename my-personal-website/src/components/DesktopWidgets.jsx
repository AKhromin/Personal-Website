import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import TimerIcon from '@mui/icons-material/Timer';
import TuneIcon from '@mui/icons-material/Tune';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import { GRID_CELL, gridPoint, nearestOpenCell } from '../desktopGrid';
import PomodoroSettings from './PomodoroSettings';
import usePomodoro from '../hooks/usePomodoro';
import { layoutWidgets, loadWidgetSettings, saveWidgetSettings, widgetRightColumn, WIDGETS } from '../widgets/widgetLayout';

const ARROW_OFFSETS = {
  ArrowLeft: [-GRID_CELL, 0],
  ArrowRight: [GRID_CELL, 0],
  ArrowUp: [0, -GRID_CELL],
  ArrowDown: [0, GRID_CELL],
};

function WidgetFrame({ label, tooltipLabel, description, compact, rect, area, onMove, children }) {
  const gesture = useRef(null);
  const [dragPoint, setDragPoint] = useState(null);

  const startDrag = (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    if (event.target.closest('button') && !event.target.closest('.widget-drag-handle')) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: rect, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const trackDrag = (event) => {
    const drag = gesture.current;
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    setDragPoint({
      x: Math.max(0, Math.min(area.width - rect.width, drag.start.x + dx)),
      y: Math.max(0, Math.min(area.height - rect.height, drag.start.y + dy)),
    });
  };

  const endDrag = (event) => {
    const drag = gesture.current;
    if (drag?.id !== event.pointerId) return;
    gesture.current = null;
    setDragPoint(null);
    if (drag.moved && event.type === 'pointerup') {
      onMove({ x: drag.start.x + event.clientX - drag.x, y: drag.start.y + event.clientY - drag.y });
    }
  };

  const moveWithKeys = (event) => {
    const offset = ARROW_OFFSETS[event.key];
    if (!offset) return;
    event.preventDefault();
    onMove({ x: rect.x + offset[0], y: rect.y + offset[1] });
  };

  return (
    <section
      className={`desktop-widget${compact ? ' widget-compact' : ''}${dragPoint ? ' widget-dragging' : ''}`}
      aria-label={label}
      style={{ left: dragPoint?.x ?? rect.x, top: dragPoint?.y ?? rect.y, width: rect.width, height: rect.height }}
      onPointerDown={startDrag}
      onPointerMove={trackDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
    >
      <button type="button" className="widget-drag-handle" aria-label={`Move ${label} with arrow keys`} title={compact ? undefined : 'Drag or use arrow keys'} onKeyDown={moveWithKeys}>
        <DragIndicatorIcon sx={{ fontSize: 16 }} />
      </button>
      {children}
      {compact && (
        <span className="widget-tooltip" data-side={rect.x < area.width / 2 ? 'right' : 'left'} aria-hidden="true">
          <strong>{tooltipLabel}</strong>
          <span>{description}</span>
        </span>
      )}
    </section>
  );
}

function WidgetEditor({ rect, area, settings, setSettings }) {
  const [open, setOpen] = useState(false);
  const editorId = useId();
  const tools = useRef(null);
  const trigger = useRef(null);
  const spaceBelow = area.height - rect.y - rect.height - 8;
  const spaceAbove = rect.y - 8;
  const openAbove = spaceBelow < 238 && spaceAbove > spaceBelow;

  useEffect(() => {
    if (!open) return undefined;
    const dismiss = (event) => {
      if (!tools.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const update = (id, change) => setSettings((previous) => ({
    ...previous,
    [id]: { ...previous[id], ...change },
  }));

  return (
    <div className="widget-tools" ref={tools} style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}>
      <button
        type="button"
        className="widget-edit-button"
        ref={trigger}
        aria-expanded={open}
        aria-controls={editorId}
        onClick={() => setOpen((previous) => !previous)}
      >
        <TuneIcon sx={{ fontSize: 15 }} />
        Edit widgets
      </button>
      <div id={editorId} className="widget-editor" hidden={!open} data-above={openAbove || undefined}
        style={{ maxHeight: openAbove ? spaceAbove : spaceBelow }}>
        {WIDGETS.map(({ id, label }) => (
          <div className="widget-editor-row" key={id}>
            <label>
              <input
                type="checkbox"
                role="switch"
                checked={settings[id].visible}
                onChange={(event) => update(id, { visible: event.target.checked })}
              />
              {label}
            </label>
            <select
              aria-label={`${label} size`}
              value={settings[id].compact ? 'compact' : 'expanded'}
              onChange={(event) => update(id, { compact: event.target.value === 'compact' })}
            >
              <option value="expanded">Expanded</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        ))}
        {WIDGETS.some(({ id }) => settings[id].position) && (
          <button
            type="button"
            className="widget-reset-positions"
            onClick={() => {
              setSettings((previous) => Object.fromEntries(WIDGETS.map(({ id }) => [
                id, { ...previous[id], position: null },
              ])));
              trigger.current.focus();
            }}
          >
            Reset positions
          </button>
        )}
      </div>
    </div>
  );
}

function PomodoroCard({ timer, compact, onOpenSettings }) {
  const { phaseLabel, sessionNumber, settings } = timer;
  const action = timer.running ? 'Pause' : timer.paused ? 'Resume' : 'Start';
  const gear = (
    <button
      type="button"
      className="widget-timer-settings"
      aria-label="Pomodoro settings"
      aria-haspopup="dialog"
      title="Pomodoro settings"
      onClick={onOpenSettings}
    >
      <SettingsIcon sx={{ fontSize: compact ? 13 : 16 }} />
    </button>
  );
  if (compact) {
    return (
      <>
        <button
          type="button"
          className="widget-mini widget-mini-timer"
          style={{ '--timer-progress': `${timer.progress * 100}%` }}
          aria-label={`${action} Pomodoro. ${phaseLabel}, ${timer.time} remaining`}
          onClick={timer.toggle}
        >
          <TimerIcon sx={{ fontSize: 23 }} />
        </button>
        {gear}
      </>
    );
  }

  return (
    <div className="widget-pomodoro-card">
      <div>
        <div className="widget-timer-phase">
          <TimerIcon sx={{ fontSize: 14 }} />
          {phaseLabel} · {sessionNumber}/{settings.sessions}
        </div>
        <div className="widget-timer-time" aria-label={`${timer.time} remaining`}>{timer.time}</div>
      </div>
      <div className="widget-timer-actions">
        <button type="button" className="widget-timer-start" onClick={timer.toggle}>{action}</button>
        <button type="button" className="widget-timer-reset" onClick={timer.reset} title="Reset timer" aria-label="Reset timer">
          <RestartAltIcon sx={{ fontSize: 17 }} />
        </button>
        {gear}
      </div>
    </div>
  );
}

function DesktopWidgets({ time, iconPositions }) {
  const { now, period, greeting } = time;
  const layer = useRef(null);
  const [{ area, iconSizes }, setWorkspace] = useState({ area: { width: 0, height: 0 }, iconSizes: {} });
  const [settings, setSettings] = useState(loadWidgetSettings);
  const [pomodoroSettingsOpen, setPomodoroSettingsOpen] = useState(false);
  const timer = usePomodoro(now);

  useLayoutEffect(() => {
    const element = layer.current;
    const icons = [...element.parentElement.querySelectorAll('[data-desktop-icon]')];
    const measure = () => setWorkspace({
      area: { width: element.clientWidth, height: element.clientHeight },
      iconSizes: Object.fromEntries(icons.map((icon) => {
        const { width, height } = icon.getBoundingClientRect();
        return [icon.dataset.desktopIcon, { width, height }];
      })),
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    icons.forEach((icon) => observer.observe(icon));
    return () => observer.disconnect();
  }, []);

  useEffect(() => saveWidgetSettings(settings), [settings]);

  const iconCells = Object.entries(iconPositions).map(([id, point]) => ({ ...point, ...iconSizes[id] }));
  const layout = layoutWidgets(area, settings, iconCells);
  const moveWidget = (id, point) => {
    const rect = layout.positions[id];
    const size = { width: rect.width, height: rect.height };
    const otherWidgets = Object.entries(layout.positions)
      .filter(([key]) => key !== id)
      .map(([, position]) => position);
    const occupied = [layout.editButton, ...iconCells, ...otherWidgets];
    const rightColumn = widgetRightColumn(area, size);
    const cell = nearestOpenCell(point, area, size, occupied, rightColumn);
    if (!cell) return;
    const snapped = gridPoint(cell, rightColumn);
    if (snapped.x === rect.x && snapped.y === rect.y) return;
    const position = { ...cell, rightAligned: cell.col === rightColumn.col };
    setSettings((previous) => ({ ...previous, [id]: { ...previous[id], position } }));
  };

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const year = now.getFullYear();
  const dayOfYear = (Date.UTC(year, now.getMonth(), now.getDate()) - Date.UTC(year, 0, 1)) / 86_400_000 + 1;
  const daysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86_400_000;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replaceAll('_', ' ');
  const PeriodIcon = period === 'night' ? DarkModeIcon : period === 'day' ? WbSunnyIcon : WbTwilightIcon;
  const titles = {
    clock: `${hours}:${minutes} · ${date}`,
    greeting,
    stats: `${timezone} · Day ${dayOfYear} of ${daysInYear}`,
    pomodoro: `${timer.phaseLabel} · ${timer.time}`,
  };
  const miniIcons = { clock: AccessTimeIcon, greeting: PeriodIcon, stats: CalendarTodayIcon };

  const renderWidget = (id, compact) => {
    if (id === 'pomodoro') {
      return <PomodoroCard compact={compact} timer={timer} onOpenSettings={() => setPomodoroSettingsOpen(true)} />;
    }
    if (compact) {
      const Icon = miniIcons[id];
      return <div className="widget-mini" role="img" aria-label={titles[id]}><Icon sx={{ fontSize: 23 }} /></div>;
    }
    if (id === 'clock') {
      return (
        <div className="widget-clock-card">
          <div className="widget-clock-time">
            <span className="clock-digit">{hours}</span>
            <span className="clock-separator">:</span>
            <span className="clock-digit">{minutes}</span>
            <span className="clock-seconds">{seconds}</span>
          </div>
          <div className="widget-clock-date"><CalendarTodayIcon sx={{ fontSize: 13 }} />{date}</div>
        </div>
      );
    }
    if (id === 'greeting') {
      return (
        <div className="widget-greeting-card">
          <div className="widget-greeting-icon"><PeriodIcon sx={{ fontSize: 26 }} /></div>
          <div className="widget-greeting-text">
            <span className="widget-greeting-hello">{greeting}</span>
            {period === 'dawn' && <span className="widget-greeting-sub">A new day begins</span>}
            {period === 'dusk' && <span className="widget-greeting-sub">Sunset vibes</span>}
          </div>
        </div>
      );
    }
    return (
      <div className="widget-stats-card">
        <div className="widget-stat-row">
          <AccessTimeIcon sx={{ fontSize: 14 }} />
          <span>Timezone</span>
          <span className="widget-stat-value">{timezone}</span>
        </div>
        <div className="widget-stat-row">
          <CalendarTodayIcon sx={{ fontSize: 14 }} />
          <span>Day of year</span>
          <span className="widget-stat-value">{dayOfYear} / {daysInYear}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="desktop-widgets" ref={layer}>
      {area.width > 0 && WIDGETS.filter(({ id }) => settings[id].visible).map(({ id, label }) => (
        <WidgetFrame key={id} label={label} tooltipLabel={id === 'pomodoro' ? 'Focus Timer' : label} description={titles[id]}
          compact={settings[id].compact} rect={layout.positions[id]} area={area} onMove={(point) => moveWidget(id, point)}>
          {renderWidget(id, settings[id].compact)}
        </WidgetFrame>
      ))}
      {area.width > 0 && <WidgetEditor rect={layout.editButton} area={area} settings={settings} setSettings={setSettings} />}
      {pomodoroSettingsOpen && <PomodoroSettings timer={timer} onClose={() => setPomodoroSettingsOpen(false)} />}
      <span className="widget-announcement" role="status">
        {timer.phaseLabel} timer {timer.running ? 'running' : timer.paused ? 'paused' : 'ready'}
      </span>
    </div>
  );
}

export default DesktopWidgets;
