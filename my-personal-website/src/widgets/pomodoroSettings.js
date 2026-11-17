export const PRESETS = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'For routine tasks, studying, and everyday writing.',
    settings: { focus: 25, shortBreak: 5, longBreak: 15, sessions: 4 },
  },
  {
    id: 'extended',
    label: 'Extended / Desk Worker',
    description: 'For deep work, coding, and tasks that take time to get into.',
    settings: { focus: 50, shortBreak: 10, longBreak: 30, sessions: 4 },
  },
  {
    id: 'ultradian',
    label: 'Ultradian Rhythm',
    description: 'For longer stretches of creative work or research.',
    settings: { focus: 90, shortBreak: 20, longBreak: 30, sessions: 2 },
  },
  {
    id: 'micro',
    label: 'Micro / Quick Starts',
    description: 'For getting started or clearing small, repetitive tasks.',
    settings: { focus: 15, shortBreak: 3, longBreak: 10, sessions: 4 },
  },
];

export const TIMING_FIELDS = [
  { key: 'focus', label: 'Focus time', max: 999, unit: 'min' },
  { key: 'shortBreak', label: 'Short break', max: 999, unit: 'min' },
  { key: 'longBreak', label: 'Long break', max: 999, unit: 'min' },
  { key: 'sessions', label: 'Sessions before a long break', max: 99 },
];

export function sameTimings(a, b) {
  return TIMING_FIELDS.every(({ key }) => a[key] === b[key]);
}

export function validTimings(settings) {
  return TIMING_FIELDS.every(({ key, max }) => {
    const value = settings?.[key];
    return Number.isInteger(value) && value >= 1 && value <= max;
  });
}
