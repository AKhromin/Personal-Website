import { useEffect, useState } from 'react';
import { PRESETS, sameTimings, validTimings } from '../widgets/pomodoroSettings.js';

const STORAGE_KEY = 'desktop-pomodoro-settings';
const PHASE_LABELS = { focus: 'Focus', shortBreak: 'Short break', longBreak: 'Long break' };

function loadTimings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (validTimings(saved)) return saved;
  } catch {
    // Use Classic if browser storage is unavailable.
  }
  return PRESETS[0].settings;
}

function newSession(settings, phase = 'focus', completed = 0) {
  return { settings, phase, completed, remaining: settings[phase] * 60_000, deadline: null };
}

function nextSession({ settings, phase, completed }) {
  if (phase === 'focus') {
    const finished = completed + 1;
    const nextBreak = finished === settings.sessions ? 'longBreak' : 'shortBreak';
    return newSession(settings, nextBreak, finished);
  }
  return newSession(settings, 'focus', phase === 'longBreak' ? 0 : completed);
}

export default function usePomodoro(now) {
  const [session, setSession] = useState(() => newSession(loadTimings()));
  const { settings, phase, deadline, completed } = session;
  const duration = settings[phase] * 60_000;
  const running = deadline !== null;
  const remaining = running ? Math.max(0, deadline - now.getTime()) : session.remaining;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // The timer still works with in-memory settings.
    }
  }, [settings]);

  useEffect(() => {
    if (running && remaining === 0) {
      setSession((previous) => previous.deadline === deadline ? nextSession(previous) : previous);
    }
  }, [deadline, remaining, running]);

  const toggle = () => {
    const timestamp = Date.now();
    setSession((previous) => {
      if (previous.deadline === null) {
        return { ...previous, deadline: timestamp + previous.remaining };
      }
      const left = previous.deadline - timestamp;
      return left > 0 ? { ...previous, remaining: left, deadline: null } : nextSession(previous);
    });
  };

  const reset = () => setSession((previous) => newSession(previous.settings, previous.phase, previous.completed));
  const applySettings = (next) => {
    if (!validTimings(next)) return;
    setSession((previous) => sameTimings(previous.settings, next) ? previous : newSession(next));
  };

  const seconds = Math.ceil(Math.min(remaining, duration) / 1000);
  const time = [Math.floor(seconds / 60), seconds % 60].map((unit) => String(unit).padStart(2, '0')).join(':');
  const progress = Math.max(0, 1 - remaining / duration);
  const paused = !running && session.remaining < duration;

  return {
    settings,
    phaseLabel: PHASE_LABELS[phase],
    sessionNumber: phase === 'focus' ? completed + 1 : completed,
    hasProgress: running || paused || completed > 0,
    running,
    paused,
    time,
    progress,
    toggle,
    reset,
    applySettings,
  };
}
