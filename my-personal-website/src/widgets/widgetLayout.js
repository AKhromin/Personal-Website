import { GRID_CELL, GRID_INSET, gridLimits, gridPoint, nearestOpenCell, rectsOverlap } from '../desktopGrid';

export const WIDGETS = [
  { id: 'clock', label: 'Clock' },
  { id: 'greeting', label: 'Greeting' },
  { id: 'stats', label: 'Date & timezone' },
  { id: 'pomodoro', label: 'Pomodoro' },
];

const STORAGE_KEY = 'desktop-widget-layout';

export function loadWidgetSettings() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    // Use defaults if storage or a saved preference is unavailable.
  }
  return Object.fromEntries(WIDGETS.map(({ id }) => {
    const item = saved?.[id];
    const position = item?.position;
    const hasGridPosition = Number.isSafeInteger(position?.col) && position.col >= 0
      && Number.isSafeInteger(position?.row) && position.row >= 0;
    return [id, {
      visible: item?.visible !== false,
      compact: item?.compact === true,
      position: hasGridPosition ? position : null,
    }];
  }));
}

export function saveWidgetSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // The in-memory layout still works if storage is unavailable.
  }
}

function rightAlignedX(area, width) {
  return Math.max(0, area.width - GRID_INSET - width);
}

export function widgetRightColumn(area, size) {
  return { col: gridLimits(area, size).col, x: rightAlignedX(area, size.width) };
}

function dockRect(area, row, width, height) {
  return {
    x: rightAlignedX(area, width),
    y: Math.max(0, Math.min(GRID_INSET + row * GRID_CELL, area.height - height - 8)),
    width,
    height,
  };
}

export function layoutWidgets(area, settings, iconCells) {
  const visible = WIDGETS.map(({ id }, homeRow) => ({ id, homeRow }))
    .filter(({ id }) => settings[id].visible);
  const docked = visible.filter(({ id }) => !settings[id].position);
  const moved = visible.filter(({ id }) => settings[id].position);
  // Keep the controls below the default stack when its slots are empty.
  const editButton = dockRect(area, WIDGETS.length, 122, 34);
  const occupied = [editButton, ...iconCells];
  const positions = {};

  [...docked, ...moved].forEach(({ id, homeRow }) => {
    const { compact, position } = settings[id];
    const size = compact ? { width: 52, height: 52 } : { width: 280, height: 88 };
    const desired = dockRect(area, homeRow, size.width, size.height);
    const useDock = !position && !occupied.some((other) => rectsOverlap(desired, other));
    const rightColumn = widgetRightColumn(area, size);
    const savedCell = position?.rightAligned === true ? { ...position, col: rightColumn.col } : position;
    const point = savedCell ? gridPoint(savedCell, rightColumn) : desired;
    const cell = useDock ? null : nearestOpenCell(point, area, size, occupied, rightColumn);
    const rect = cell ? { ...gridPoint(cell, rightColumn), ...size } : desired;
    positions[id] = rect;
    occupied.push(rect);
  });
  return { editButton, positions };
}
