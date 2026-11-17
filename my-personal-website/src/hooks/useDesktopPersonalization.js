import { useEffect, useState } from 'react';

export const ACCENTS = {
  blue: { label: 'Classic Blue', swatch: '#5fa8d3', ink: '#2f6b91' },
  cyan: { label: 'Neon Cyan', swatch: '#4ee1ed', ink: '#096d77' },
  orange: { label: 'Cyber Orange', swatch: '#ff9c62', ink: '#a64520' },
  green: { label: 'Retro Green', swatch: '#80df9a', ink: '#27683f' },
  pink: { label: 'Neon Pink', swatch: '#ff86ca', ink: '#a32771' },
};

export const WALLPAPERS = {
  desk: 'Cozy Desk',
  matrix: 'Matrix Grid',
  skyline: 'Pixel Skyline',
  gradient: 'Minimal Gradient',
};

export const LIGHTING = {
  auto: 'Follow local time',
  day: 'Daylight',
  dusk: 'Sunset',
  night: 'Late night',
};

export const PRESETS = {
  studio: { label: 'Default Studio', accent: 'blue', wallpaper: 'desk', lighting: 'auto' },
  synthwave: { label: 'Dark Synthwave', accent: 'pink', wallpaper: 'skyline', lighting: 'night' },
  classic: { label: 'Classic 90s OS', accent: 'blue', wallpaper: 'gradient', lighting: 'day' },
  terminal: { label: 'Developer Terminal', accent: 'green', wallpaper: 'matrix', lighting: 'night' },
};

export const DESK_ITEMS = [
  { id: 'plant', label: 'Plant', default: true },
  { id: 'coffee', label: 'Coffee Mug', default: true },
  { id: 'lamp', label: 'Desk Lamp', default: true },
  { id: 'cat', label: 'Cat', default: false },
  { id: 'books', label: 'Books', default: true },
  { id: 'headphones', label: 'Headphones', default: false },
  { id: 'photo', label: 'Photo Frame', default: true },
  { id: 'cactus', label: 'Mini Cactus', default: false },
];

const STORAGE_KEY = 'desktop-personalization';

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function savedChoice(choices, value, fallback) {
  return typeof value === 'string' && Object.hasOwn(choices, value) ? value : fallback;
}

function loadSettings() {
  const saved = readStorage(STORAGE_KEY);
  const preset = savedChoice(PRESETS, saved?.preset, 'studio');
  const defaults = PRESETS[preset];
  const deskItems = saved?.deskItems ?? readStorage('desk-scene-assets');
  return {
    preset,
    accent: savedChoice(ACCENTS, saved?.accent, defaults.accent),
    wallpaper: savedChoice(WALLPAPERS, saved?.wallpaper, defaults.wallpaper),
    lighting: savedChoice(LIGHTING, saved?.lighting, defaults.lighting),
    soundEffects: saved?.soundEffects === true,
    lampOn: saved?.lampOn !== false,
    deskItems: Object.fromEntries(DESK_ITEMS.map(({ id, default: initial }) => [
      id,
      typeof deskItems?.[id] === 'boolean' ? deskItems[id] : initial,
    ])),
  };
}

export default function useDesktopPersonalization() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Keep applying settings for this visit if storage is unavailable.
    }
  }, [settings]);

  return [settings, setSettings];
}
