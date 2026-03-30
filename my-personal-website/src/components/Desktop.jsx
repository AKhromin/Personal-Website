import React, { useState, useEffect, useRef, useCallback } from 'react';
import DesktopIcons from './DesktopIcons';
import DesktopWidgets from './DesktopWidgets';
import DeskScene from './DeskScene';
import Window from './Window';
import Taskbar from './Taskbar';
import About from './About';
import Projects from './Projects';
import ProjectDetail from './ProjectDetail';
import Education from './Education';
import Skills from './Skills';
import Contact from './Contact';
import Terminal from './Terminal';
import SnakeGame from './SnakeGame';
import MinesweeperGame from './MinesweeperGame';
import { useDesktop } from '../context/DesktopContext';
import useTimeTheme from '../hooks/useTimeTheme';
import RefreshIcon from '@mui/icons-material/Refresh';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

function SnapPreview() {
  const { snapPreview } = useDesktop();
  if (!snapPreview) return null;

  const TASKBAR_HEIGHT = 48;
  const h = `calc(100% - ${TASKBAR_HEIGHT}px)`;
  const halfH = `calc(50% - ${TASKBAR_HEIGHT / 2}px)`;

  const styles = {
    left: { top: 0, left: 0, width: '50%', height: h },
    right: { top: 0, left: '50%', width: '50%', height: h },
    maximize: { top: 0, left: 0, width: '100%', height: h },
    'top-left': { top: 0, left: 0, width: '50%', height: halfH },
    'top-right': { top: 0, left: '50%', width: '50%', height: halfH },
    'bottom-left': { top: '50%', left: 0, width: '50%', height: halfH },
    'bottom-right': { top: '50%', left: '50%', width: '50%', height: halfH },
  };

  const zoneStyle = styles[snapPreview];
  if (!zoneStyle) return null;

  return <div className="snap-preview" style={zoneStyle} />;
}

/* ---- Right-click context menu ---- */
function ContextMenu({ x, y, onClose }) {
  const { openWindow } = useDesktop();
  const menuRef = useRef(null);

  useEffect(() => {
    const handle = () => onClose();
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [onClose]);

  // Adjust position to stay on screen
  const style = { left: x, top: y };

  const items = [
    { icon: RefreshIcon, label: 'Refresh', shortcut: 'F5', action: () => window.location.reload() },
    'divider',
    { icon: PersonIcon, label: 'Open About', action: () => openWindow('about') },
    { icon: FolderOpenIcon, label: 'Open Projects', action: () => openWindow('projects') },
    { icon: CodeIcon, label: 'Open Skills', action: () => openWindow('skills') },
    'divider',
    { icon: InfoIcon, label: 'About this PC', action: () => openWindow('about') },
  ];

  return (
    <div className="context-menu" style={style} ref={menuRef}>
      {items.map((item, i) =>
        item === 'divider' ? (
          <div key={i} className="context-menu-divider" />
        ) : (
          <button key={i} className="context-menu-item" onClick={item.action}>
            <item.icon sx={{ fontSize: 16 }} />
            {item.label}
            {item.shortcut && <span className="shortcut">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );
}

function Desktop() {
  const { projectWindows } = useDesktop();
  const [contextMenu, setContextMenu] = useState(null);
  const { isNight } = useTimeTheme();

  const handleContextMenu = useCallback((e) => {
    // Only show on the desktop background, not on windows/icons
    if (e.target.closest('.os-window') || e.target.closest('.desktop-icon') || e.target.closest('.taskbar')) return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className={`desktop ${isNight ? 'night-mode' : ''}`} onContextMenu={handleContextMenu}>
      <DeskScene />
      <DesktopIcons />
      <DesktopWidgets />
      <SnapPreview />

      <Window id="about"><About /></Window>
      <Window id="projects"><Projects /></Window>
      {Object.entries(projectWindows).map(([windowId, project]) => (
        <Window key={windowId} id={windowId}>
          <ProjectDetail project={project} />
        </Window>
      ))}
      <Window id="education"><Education /></Window>
      <Window id="skills"><Skills /></Window>
      <Window id="contact"><Contact /></Window>
      <Window id="terminal"><Terminal /></Window>
      <Window id="snake"><SnakeGame /></Window>
      <Window id="minesweeper"><MinesweeperGame /></Window>

      <Taskbar />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default Desktop;
