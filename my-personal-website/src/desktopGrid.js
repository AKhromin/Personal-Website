export const GRID_CELL = 96;
export const GRID_INSET = 24;

export function gridPoint({ col, row }, rightColumn) {
  return {
    x: col === rightColumn?.col ? rightColumn.x : GRID_INSET + col * GRID_CELL,
    y: GRID_INSET + row * GRID_CELL,
  };
}

export function gridLimits(area, size) {
  return {
    col: Math.max(0, Math.floor((area.width - size.width - GRID_INSET) / GRID_CELL)),
    row: Math.max(0, Math.floor((area.height - size.height - GRID_INSET) / GRID_CELL)),
  };
}

export function snapToGrid({ x, y }, area, size, rightColumn) {
  const limit = gridLimits(area, size);
  const row = Math.max(0, Math.min(limit.row, Math.round((y - GRID_INSET) / GRID_CELL)));
  const regularLimit = rightColumn ? rightColumn.col - 1 : limit.col;
  const col = Math.max(0, Math.min(regularLimit, Math.round((x - GRID_INSET) / GRID_CELL)));
  if (rightColumn && Math.abs(x - rightColumn.x) <= Math.abs(x - gridPoint({ col, row }).x)) {
    return { col: rightColumn.col, row };
  }
  return { col, row };
}

export function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x
    && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function nearestOpenCell(point, area, size, occupied, rightColumn) {
  const target = snapToGrid(point, area, size, rightColumn);
  const limit = gridLimits(area, size);
  const fits = (cell) => !occupied.some((other) => rectsOverlap({ ...gridPoint(cell, rightColumn), ...size }, other));
  if (fits(target)) return target;

  let nearest = null;
  let distance = Infinity;
  for (let row = 0; row <= limit.row; row++) {
    for (let col = 0; col <= limit.col; col++) {
      const offset = (row - target.row) ** 2 + (col - target.col) ** 2;
      if (offset < distance && fits({ col, row })) {
        distance = offset;
        nearest = { col, row };
      }
    }
  }
  return nearest;
}
