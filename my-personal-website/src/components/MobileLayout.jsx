import React, { useState, useEffect, useRef, useCallback } from 'react';
import MobileAppIcon from './mobile/MobileAppIcon';
import MobilePageView from './mobile/MobilePageView';

import About from './About';
import ProjectDetail from './ProjectDetail';
import Education from './Education';
import Skills from './Skills';
import Contact from './Contact';
import SnakeGame from './SnakeGame';
import MinesweeperGame from './MinesweeperGame';
import Terminal from './Terminal';
import projectsData from '../data/projectsData';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import SchoolIcon from '@mui/icons-material/School';
import DataObjectIcon from '@mui/icons-material/DataObject';
import EmailIcon from '@mui/icons-material/Email';
import TerminalIcon from '@mui/icons-material/Terminal';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';

const MUSIC_URL = `${import.meta.env.BASE_URL}assets/audio/lofi-background.mp3`;

/* ---- Status bar (cosmetic) ---- */
function MobileStatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mobile-status-bar">
      <span className="mobile-status-time">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="mobile-status-right">
        <span className="mobile-signal">●●●○</span>
        <span className="mobile-battery">🔋</span>
      </span>
    </div>
  );
}

/* ---- App definitions ---- */
const APPS = [
  { id: 'about', label: 'About Me', icon: PersonIcon, color: '#3b82f6' },
  { id: 'projects', label: 'Projects', icon: FolderIcon, color: '#8b5cf6' },
  { id: 'education', label: 'Education', icon: SchoolIcon, color: '#10b981' },
  { id: 'skills', label: 'Skills', icon: DataObjectIcon, color: '#f59e0b' },
  { id: 'contact', label: 'Contact', icon: EmailIcon, color: '#ef4444' },
  { id: 'terminal', label: 'Terminal', icon: TerminalIcon, color: '#1e1e2e' },
  { id: 'snake', label: 'Snake', icon: SportsEsportsIcon, color: '#2d8a4e' },
  { id: 'minesweeper', label: 'Minesweeper', icon: SportsEsportsIcon, color: '#6a4c93' },
  { id: 'github', label: 'GitHub', icon: GitHubIcon, color: '#333' },
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon, color: '#0077b5' },
];

function MobileLayout() {
  const [activePage, setActivePage] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play().catch(() => {}); }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const openApp = (id) => {
    if (id === 'github') {
      window.open('https://github.com/AKhromin', '_blank');
      return;
    }
    if (id === 'linkedin') {
      window.open('https://www.linkedin.com/in/alexey-khromin', '_blank');
      return;
    }
    setActivePage(id);
    setActiveProject(null);
  };

  const goBack = () => {
    if (activeProject) {
      setActiveProject(null);
      setActivePage('projects');
    } else {
      setActivePage(null);
    }
  };

  const PAGE_TITLES = {
    about: 'About Me',
    projects: 'Projects',
    education: 'Education',
    skills: 'Skills',
    contact: 'Contact',
    terminal: 'Terminal',
    snake: 'Snake',
    minesweeper: 'Minesweeper',
  };

  const renderPageContent = () => {
    if (activeProject) {
      return (
        <MobilePageView title={activeProject.title} onBack={goBack}>
          <ProjectDetail project={activeProject} />
        </MobilePageView>
      );
    }

    const title = PAGE_TITLES[activePage] || activePage;

    const contentMap = {
      about: <About />,
      projects: <MobileProjects onOpenProject={(p) => setActiveProject(p)} />,
      education: <Education />,
      skills: <Skills />,
      contact: <Contact />,
      terminal: <Terminal />,
      snake: <SnakeGame />,
      minesweeper: <MinesweeperGame />,
    };

    return (
      <MobilePageView title={title} onBack={goBack}>
        {contentMap[activePage] || <p>Page not found</p>}
      </MobilePageView>
    );
  };

  if (activePage || activeProject) {
    return (
      <div className="mobile-layout">
        <MobileStatusBar />
        {renderPageContent()}
      </div>
    );
  }

  const allApps = [
    ...APPS,
    {
      id: 'music',
      label: isPlaying ? 'Pause' : 'Music',
      icon: MusicNoteIcon,
      color: isPlaying ? '#50fa7b' : '#555',
    },
  ];

  return (
    <div className="mobile-layout">
      <MobileStatusBar />
      <div className="mobile-home">
        <div className="mobile-header">
          <div className="mobile-profile-pic">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/ProfilePicture.jpg`}
              alt="Alexey"
            />
          </div>
          <h1 className="mobile-name">Alexey Khromin</h1>
          <p className="mobile-tagline">CS Student & Developer</p>
        </div>

        {/* View mode toggle */}
        <div className="mobile-view-toggle">
          <button
            className={`mobile-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <ViewModuleIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            className={`mobile-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <ViewListIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {viewMode === 'grid' ? (
          <div className="mobile-app-grid">
            {allApps.map((app) => (
              <MobileAppIcon
                key={app.id}
                icon={app.icon}
                label={app.label}
                color={app.color}
                onClick={() => app.id === 'music' ? toggleMusic() : openApp(app.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mobile-app-list">
            {allApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  className="mobile-app-list-item"
                  onClick={() => app.id === 'music' ? toggleMusic() : openApp(app.id)}
                >
                  <div className="mobile-app-list-icon" style={{ background: app.color }}>
                    <Icon sx={{ fontSize: 22, color: '#fff' }} />
                  </div>
                  <span className="mobile-app-list-label">{app.label}</span>
                  <span className="mobile-app-list-arrow">›</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Mobile Projects (uses full shared data) ---- */
function MobileProjects({ onOpenProject }) {
  return (
    <div className="mobile-projects-list">
      {projectsData.map((project, i) => (
        <button key={i} className="mobile-project-card" onClick={() => onOpenProject(project)}>
          <div className="mobile-project-thumb">
            {project.media[0] && <img src={project.media[0].url} alt={project.title} />}
          </div>
          <div className="mobile-project-info">
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <div className="mobile-project-tags">
              {project.technologies.slice(0, 3).map((t, j) => (
                <span key={j} className="mobile-tag">{t}</span>
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default MobileLayout;
