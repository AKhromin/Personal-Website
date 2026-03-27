import React, { useState, useCallback, useRef } from 'react';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import TerminalIcon from '@mui/icons-material/Terminal';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useDesktop } from '../context/DesktopContext';

/* ---- CSS-based file icon (rectangle with folded corner + extension label) ---- */
function FileIcon({ extension, color }) {
  return (
    <div className="file-icon-shape" style={{ '--file-color': color }}>
      <div className="file-icon-fold" />
      <span className="file-icon-ext">{extension}</span>
    </div>
  );
}

/* ---- CSS-based folder icon with a small overlay icon in the center ---- */
function FolderIcon({ OverlayIcon, color }) {
  return (
    <div className="folder-icon-shape" style={{ '--folder-color': color }}>
      <div className="folder-icon-tab" />
      <div className="folder-icon-body">
        {OverlayIcon && (
          <OverlayIcon sx={{ fontSize: 22, color: 'rgba(255,255,255,0.85)' }} />
        )}
      </div>
    </div>
  );
}

const GRID_CELL = 96; // grid snap size in px
const TASKBAR_HEIGHT = 48;

const icons = [
  {
    id: 'about',
    label: 'about_me.txt',
    render: () => <FileIcon extension="TXT" color="#5a8a6e" />,
    defaultGrid: { col: 0, row: 0 },
  },
  {
    id: 'projects',
    label: 'Projects',
    render: () => <FolderIcon OverlayIcon={CodeIcon} color="#3d7ea6" />,
    defaultGrid: { col: 0, row: 1 },
  },
  {
    id: 'education',
    label: 'Education',
    render: () => <FolderIcon OverlayIcon={SchoolIcon} color="#6a7b47" />,
    defaultGrid: { col: 0, row: 2 },
  },
  {
    id: 'skills',
    label: 'skills.json',
    render: () => <FileIcon extension="JSON" color="#7a6599" />,
    defaultGrid: { col: 0, row: 3 },
  },
  {
    id: 'contact',
    label: 'contact.exe',
    render: () => <FileIcon extension="EXE" color="#b05c3a" />,
    defaultGrid: { col: 0, row: 4 },
  },
  {
    id: 'terminal',
    label: 'terminal.sh',
    render: () => <FileIcon extension="SH" color="#3a3a3a" />,
    defaultGrid: { col: 0, row: 5 },
  },
  {
    id: 'snake',
    label: 'snake.game',
    render: () => <FileIcon extension="GAME" color="#2d8a4e" />,
    defaultGrid: { col: 1, row: 0 },
  },
  {
    id: 'minesweeper',
    label: 'minesweeper.game',
    render: () => <FileIcon extension="GAME" color="#6a4c93" />,
    defaultGrid: { col: 1, row: 1 },
  },
];

function DesktopIcons() {
  const { openWindow } = useDesktop();
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(
      icons.map((icon) => [
        icon.id,
        { x: 24 + icon.defaultGrid.col * GRID_CELL, y: 24 + icon.defaultGrid.row * GRID_CELL },
      ])
    )
  );
  const dragRef = useRef(null);

  const handleMouseDown = useCallback(
    (e, iconId) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = { ...positions[iconId] };
      let didDrag = false;

      const handleMouseMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!didDrag && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        didDrag = true;
        dragRef.current = iconId;

        setPositions((prev) => ({
          ...prev,
          [iconId]: { x: startPos.x + dx, y: startPos.y + dy },
        }));
      };

      const handleMouseUp = (e) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';

        if (didDrag) {
          // Snap to grid
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          let rawX = startPos.x + dx;
          let rawY = startPos.y + dy;

          // Clamp within desktop bounds
          const maxX = window.innerWidth - GRID_CELL;
          const maxY = window.innerHeight - TASKBAR_HEIGHT - GRID_CELL;
          rawX = Math.max(0, Math.min(maxX, rawX));
          rawY = Math.max(0, Math.min(maxY, rawY));

          const snappedX = Math.round(rawX / GRID_CELL) * GRID_CELL + 24;
          const snappedY = Math.round(rawY / GRID_CELL) * GRID_CELL + 24;

          setPositions((prev) => ({
            ...prev,
            [iconId]: { x: snappedX, y: snappedY },
          }));

          // Prevent the click from firing after drag
          setTimeout(() => { dragRef.current = null; }, 0);
        } else {
          dragRef.current = null;
        }
      };

      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [positions]
  );

  const handleClick = useCallback(
    (iconId) => {
      if (dragRef.current) return;
      openWindow(iconId);
    },
    [openWindow]
  );

  return (
    <div className="desktop-icons">
      {icons.map(({ id, label, render }) => (
        <button
          key={id}
          className="desktop-icon"
          style={{
            position: 'absolute',
            left: positions[id].x,
            top: positions[id].y,
          }}
          onMouseDown={(e) => handleMouseDown(e, id)}
          onClick={() => handleClick(id)}
        >
          <div className="desktop-icon-img">{render()}</div>
          <span className="desktop-icon-label">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default DesktopIcons;
