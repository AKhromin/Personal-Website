import React, { useCallback, useRef } from 'react';
import { useDesktop } from '../context/DesktopContext';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import CloseIcon from '@mui/icons-material/Close';

const TASKBAR_HEIGHT = 48;
const SNAP_THRESHOLD = 16; // px from edge to trigger snap

function getSnapZone(mouseX, mouseY) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const nearLeft = mouseX <= SNAP_THRESHOLD;
  const nearRight = mouseX >= vw - SNAP_THRESHOLD;
  const nearTop = mouseY <= SNAP_THRESHOLD;
  const nearBottom = mouseY >= vh - TASKBAR_HEIGHT - SNAP_THRESHOLD;

  if (nearTop && nearLeft) return 'top-left';
  if (nearTop && nearRight) return 'top-right';
  if (nearBottom && nearLeft) return 'bottom-left';
  if (nearBottom && nearRight) return 'bottom-right';
  if (nearLeft) return 'left';
  if (nearRight) return 'right';
  if (nearTop) return 'maximize';
  return null;
}

function getSnapStyle(zone) {
  const h = `calc(100% - ${TASKBAR_HEIGHT}px)`;
  const halfH = `calc(50% - ${TASKBAR_HEIGHT / 2}px)`;
  switch (zone) {
    case 'left': return { top: 0, left: 0, width: '50%', height: h };
    case 'right': return { top: 0, left: '50%', width: '50%', height: h };
    case 'maximize': return { top: 0, left: 0, width: '100%', height: h };
    case 'top-left': return { top: 0, left: 0, width: '50%', height: halfH };
    case 'top-right': return { top: 0, left: '50%', width: '50%', height: halfH };
    case 'bottom-left': return { top: '50%', left: 0, width: '50%', height: halfH };
    case 'bottom-right': return { top: '50%', left: '50%', width: '50%', height: halfH };
    default: return null;
  }
}

function Window({ id, children }) {
  const {
    windows,
    windowTitles,
    windowDefaults,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    toggleMaximize,
    snapWindow,
    setSnapPreview,
  } = useDesktop();

  const win = windows[id];
  const windowRef = useRef(null);

  // ---- DRAG (title bar) ----
  const handleTitleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      // Don't drag if clicking on window controls
      if (e.target.closest('.win-controls')) return;
      e.preventDefault();
      focusWindow(id);

      const startX = e.clientX;
      const startY = e.clientY;

      // If snapped/maximized, un-snap on drag and center the window on cursor
      const wasSnapped = win.isMaximized || win.snapZone;
      const restoreW = win.preSnapSize ? win.preSnapSize.w : win.size.w;
      const restoreH = win.preSnapSize ? win.preSnapSize.h : win.size.h;
      let startPosX = win.position.x;
      let startPosY = win.position.y;
      let didUnsnap = false;

      const handleMouseMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Un-snap on first significant move
        if (wasSnapped && !didUnsnap && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          didUnsnap = true;
          // Place window so cursor is proportionally positioned on title bar
          startPosX = e.clientX - restoreW / 2;
          startPosY = e.clientY - 19; // half title bar height
          resizeWindow(id, restoreW, restoreH, startPosX, startPosY);
        }

        let newX = didUnsnap ? (e.clientX - restoreW / 2) : (startPosX + dx);
        let newY = didUnsnap ? (e.clientY - 19) : (startPosY + dy);

        // Keep on screen
        newY = Math.max(0, Math.min(window.innerHeight - TASKBAR_HEIGHT, newY));
        const curW = didUnsnap ? restoreW : win.size.w;
        newX = Math.max(-curW + 100, Math.min(window.innerWidth - 100, newX));

        moveWindow(id, newX, newY);

        // Snap preview
        const zone = getSnapZone(e.clientX, e.clientY);
        setSnapPreview(zone);
      };

      const handleMouseUp = (e) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';

        const zone = getSnapZone(e.clientX, e.clientY);
        setSnapPreview(null);

        if (zone === 'maximize') {
          toggleMaximize(id);
        } else if (zone) {
          snapWindow(id, zone);
        }
      };

      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, win, focusWindow, moveWindow, resizeWindow, toggleMaximize, snapWindow, setSnapPreview]
  );

  // ---- RESIZE (edge/corner handles) ----
  const handleResizeMouseDown = useCallback(
    (e, direction) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      focusWindow(id);

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = win.size.w;
      const startH = win.size.h;
      const startPosX = win.position.x;
      const startPosY = win.position.y;
      const defs = windowDefaults[id];

      const handleMouseMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newW = startW;
        let newH = startH;
        let newX = startPosX;
        let newY = startPosY;

        if (direction.includes('e')) newW = startW + dx;
        if (direction.includes('w')) { newW = startW - dx; newX = startPosX + dx; }
        if (direction.includes('s')) newH = startH + dy;
        if (direction.includes('n')) { newH = startH - dy; newY = startPosY + dy; }

        // Enforce minimums — prevent position from moving if at min size
        if (newW < defs.minW) {
          if (direction.includes('w')) newX = startPosX + startW - defs.minW;
          newW = defs.minW;
        }
        if (newH < defs.minH) {
          if (direction.includes('n')) newY = startPosY + startH - defs.minH;
          newH = defs.minH;
        }

        resizeWindow(id, newW, newH, newX, newY);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };

      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [id, win.size, win.position, windowDefaults, focusWindow, resizeWindow]
  );

  if (!win.isOpen) return null;

  // Compute style based on snap/maximize state
  const isSnapped = win.snapZone;
  const isMax = win.isMaximized;
  let style;

  if (isMax) {
    style = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `calc(100% - ${TASKBAR_HEIGHT}px)`,
      zIndex: win.zIndex + 100,
      borderRadius: 0,
    };
  } else if (isSnapped) {
    const snapStyle = getSnapStyle(isSnapped);
    style = {
      position: 'absolute',
      ...snapStyle,
      zIndex: win.zIndex + 100,
      borderRadius: 0,
    };
  } else {
    style = {
      position: 'absolute',
      top: win.position.y,
      left: win.position.x,
      width: win.size.w,
      height: win.size.h,
      zIndex: win.zIndex + 100,
    };
  }

  if (win.isMinimized) {
    style.display = 'none';
  }

  const showResizeHandles = !isMax && !isSnapped && !win.isMinimized;

  return (
    <div
      ref={windowRef}
      className={`os-window ${isMax || isSnapped ? 'snapped' : ''}`}
      style={style}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar — Windows style */}
      <div className="window-titlebar" onMouseDown={handleTitleMouseDown}>
        <span className="window-title">{windowTitles[id]}</span>
        <div className="win-controls">
          <button
            className="win-control-btn minimize"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
            title="Minimize"
          >
            <MinimizeIcon sx={{ fontSize: 16 }} />
          </button>
          <button
            className="win-control-btn maximize"
            onClick={(e) => { e.stopPropagation(); toggleMaximize(id); }}
            title={isMax || isSnapped ? 'Restore' : 'Maximize'}
          >
            {isMax || isSnapped
              ? <FilterNoneIcon sx={{ fontSize: 14 }} />
              : <CropSquareIcon sx={{ fontSize: 16 }} />
            }
          </button>
          <button
            className="win-control-btn close"
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
            title="Close"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="window-content">{children}</div>

      {/* Resize Handles */}
      {showResizeHandles && (
        <>
          <div className="resize-handle n" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
          <div className="resize-handle s" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
          <div className="resize-handle e" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
          <div className="resize-handle w" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
          <div className="resize-handle ne" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
          <div className="resize-handle nw" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
          <div className="resize-handle se" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
          <div className="resize-handle sw" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
        </>
      )}
    </div>
  );
}

export default Window;
