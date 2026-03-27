import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDesktop } from '../context/DesktopContext';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TerminalIcon from '@mui/icons-material/Terminal';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const ICON_MAP = {
  about: DescriptionIcon,
  projects: FolderIcon,
  education: FolderIcon,
  skills: DataObjectIcon,
  contact: TerminalIcon,
};

function getIcon(id) {
  if (ICON_MAP[id]) return ICON_MAP[id];
  if (id.startsWith('project-')) return DescriptionIcon;
  return DescriptionIcon;
}

/* ---- Background Music Player ---- */
const MUSIC_URL = 'https://cdn.pixabay.com/audio/2024/11/28/audio_3e57e7a1f1.mp3';

function useMusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const changeVolume = useCallback((val) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }, []);

  return { isPlaying, togglePlay, volume, changeVolume, showVolume, setShowVolume };
}

/* ---- Clock ---- */
function TaskbarClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="taskbar-clock">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

/* ---- Start Menu ---- */
function StartMenu({ onClose, openWindow }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const items = [
    { icon: PersonIcon, label: 'About Me', action: () => { openWindow('about'); onClose(); } },
    { icon: CodeIcon, label: 'Projects', action: () => { openWindow('projects'); onClose(); } },
    { icon: SchoolIcon, label: 'Education', action: () => { openWindow('education'); onClose(); } },
    { icon: DataObjectIcon, label: 'Skills', action: () => { openWindow('skills'); onClose(); } },
    { icon: EmailIcon, label: 'Contact', action: () => { openWindow('contact'); onClose(); } },
    'divider',
    { icon: GitHubIcon, label: 'GitHub', action: () => { window.open('https://github.com/AKhromin', '_blank'); onClose(); } },
    { icon: LinkedInIcon, label: 'LinkedIn', action: () => { window.open('https://www.linkedin.com/in/alexey-khromin', '_blank'); onClose(); } },
  ];

  return (
    <div className="start-menu" ref={menuRef}>
      <div className="start-menu-header">
        <div className="start-menu-avatar">AK</div>
        <div>
          <div className="start-menu-name">Alexey Khromin</div>
          <div className="start-menu-subtitle">Portfolio OS</div>
        </div>
      </div>
      {items.map((item, i) =>
        item === 'divider' ? (
          <div key={i} className="start-menu-divider" />
        ) : (
          <button key={i} className="start-menu-item" onClick={item.action}>
            <item.icon sx={{ fontSize: 18 }} />
            {item.label}
          </button>
        )
      )}
    </div>
  );
}

/* ---- Taskbar ---- */
function Taskbar() {
  const { windows, windowTitles, minimizeWindow, focusWindow, openWindow } = useDesktop();
  const [startOpen, setStartOpen] = useState(false);
  const music = useMusicPlayer();

  const openWindows = Object.entries(windows).filter(([, w]) => w.isOpen);
  const maxZ = Math.max(0, ...openWindows.map(([, w]) => w.zIndex));

  const handleClick = (id) => {
    const win = windows[id];
    if (win.isMinimized) {
      focusWindow(id);
    } else if (win.zIndex === maxZ) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="taskbar">
      <div className="taskbar-start">
        <button className="taskbar-logo" onClick={() => setStartOpen((prev) => !prev)}>
          AK
        </button>
      </div>
      <div className="taskbar-windows">
        {openWindows.map(([id, win]) => {
          const Icon = getIcon(id);
          const isFocused = win.zIndex === maxZ && !win.isMinimized;
          return (
            <button
              key={id}
              className={`taskbar-button ${isFocused ? 'focused' : ''} ${win.isMinimized ? 'minimized' : ''}`}
              onClick={() => handleClick(id)}
              title={windowTitles[id]}
            >
              <Icon sx={{ fontSize: 16 }} />
              <span>{windowTitles[id]}</span>
            </button>
          );
        })}
      </div>
      <div className="taskbar-right">
        <button
          className={`taskbar-tray-btn ${music.isPlaying ? 'active' : ''}`}
          onClick={music.togglePlay}
          title={music.isPlaying ? 'Pause music' : 'Play music'}
        >
          <MusicNoteIcon sx={{ fontSize: 16 }} />
        </button>
        <button
          className="taskbar-tray-btn"
          onClick={() => music.setShowVolume((prev) => !prev)}
          title="Volume"
        >
          {music.volume > 0 ? (
            <VolumeUpIcon sx={{ fontSize: 16 }} />
          ) : (
            <VolumeOffIcon sx={{ fontSize: 16 }} />
          )}
        </button>
        <TaskbarClock />
      </div>

      {music.showVolume && (
        <div className="volume-popup">
          <VolumeOffIcon sx={{ fontSize: 14, color: '#6c7086' }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={music.volume}
            onChange={(e) => music.changeVolume(parseFloat(e.target.value))}
          />
          <span className="volume-label">{Math.round(music.volume * 100)}%</span>
        </div>
      )}

      {startOpen && (
        <StartMenu onClose={() => setStartOpen(false)} openWindow={openWindow} />
      )}
    </div>
  );
}

export default Taskbar;
