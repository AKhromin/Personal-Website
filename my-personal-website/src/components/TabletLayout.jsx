import React, { useState, useEffect, useRef, useCallback } from 'react';
import MobileAppIcon from './mobile/MobileAppIcon';
import MobilePageView from './mobile/MobilePageView';
import About from './About';
import Projects from './Projects';
import ProjectDetail from './ProjectDetail';
import Education from './Education';
import Skills from './Skills';
import Contact from './Contact';
import SnakeGame from './SnakeGame';
import MinesweeperGame from './MinesweeperGame';
import Terminal from './Terminal';
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

const MUSIC_URL = `${import.meta.env.BASE_URL}assets/audio/lofi-background.mp3`;

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

/* ---- Top Bar ---- */
function TabletTopBar({ isPlaying, onToggleMusic }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="tablet-top-bar">
      <span className="tablet-top-name">Alexey Khromin — Portfolio OS</span>
      <div className="tablet-top-right">
        <button
          className={`tablet-music-btn ${isPlaying ? 'active' : ''}`}
          onClick={onToggleMusic}
        >
          <MusicNoteIcon sx={{ fontSize: 18 }} />
        </button>
        <span className="tablet-top-clock">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}


/* ---- Tablet Projects ---- */
function TabletProjects({ onOpenProject }) {
  const projectsData = [
    {
      title: 'AWS One Day Proof of Concept',
      filename: 'aws_poc.proj',
      summary: 'An AI-powered proof-of-concept generator that transforms business ideas into comprehensive analyses.',
      technologies: ['React', 'Python', 'Flask', 'LLaMA'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic1.png` }],
      description: ['Developed a full-stack web application for AI-driven business concept validation.'],
    },
    {
      title: 'Found in Translation',
      filename: 'translation_app.proj',
      summary: 'A multi-modal translation app with speech-to-text, sign language recognition, and real-time translation.',
      technologies: ['Flutter', 'Python', 'OpenCV', 'MediaPipe'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/HandSignProject/Pic1.png` }],
      description: ['Built a Flutter-based mobile app for accessible, multi-modal translation.'],
    },
    {
      title: 'Face Detection and Recognition',
      filename: 'face_recognition.proj',
      summary: 'An advanced deep learning-based face recognition app with real-time detection.',
      technologies: ['Python', 'OpenCV', 'DeepFace', 'PyTorch'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/FaceRecProject/Pic1.png` }],
      description: ['Developed a dual-mode face recognition platform for real-time and batch video analysis.'],
    },
    {
      title: 'Car Make & Model Recognition',
      filename: 'car_recognition.proj',
      summary: 'A Python-based desktop app using deep learning to recognize car makes and models.',
      technologies: ['Python', 'PyTorch', 'ResNet-34'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/CarProject/Pic1.jpg` }],
      description: ['Built a Tkinter-based desktop GUI for car image upload and recognition.'],
    },
  ];

  return (
    <div className="tablet-projects-grid">
      {projectsData.map((project, i) => (
        <button key={i} className="tablet-project-card" onClick={() => onOpenProject(project)}>
          <div className="tablet-project-thumb">
            {project.media[0] && <img src={project.media[0].url} alt={project.title} />}
          </div>
          <div className="tablet-project-info">
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ---- Main Tablet Layout ---- */
function TabletLayout() {
  const [activePage, setActivePage] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
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

  // Render active page as modal overlay
  const renderModal = () => {
    if (!activePage && !activeProject) return null;

    const title = activeProject
      ? activeProject.title
      : PAGE_TITLES[activePage] || activePage;

    const contentMap = {
      about: <About />,
      projects: <TabletProjects onOpenProject={(p) => setActiveProject(p)} />,
      education: <Education />,
      skills: <Skills />,
      contact: <Contact />,
      terminal: <Terminal />,
      snake: <SnakeGame />,
      minesweeper: <MinesweeperGame />,
    };

    return (
      <div className="tablet-modal-overlay" onClick={goBack}>
        <div className="tablet-modal" onClick={(e) => e.stopPropagation()}>
          <MobilePageView title={title} onBack={goBack}>
            {activeProject
              ? <ProjectDetail project={activeProject} />
              : contentMap[activePage] || <p>Page not found</p>
            }
          </MobilePageView>
        </div>
      </div>
    );
  };

  return (
    <div className="tablet-layout">
      <TabletTopBar isPlaying={isPlaying} onToggleMusic={toggleMusic} />

      <div className="tablet-home">
        <div className="tablet-header">
          <div className="tablet-profile-pic">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/ProfilePicture.jpg`}
              alt="Alexey"
            />
          </div>
          <div className="tablet-header-text">
            <h1>Alexey Khromin</h1>
            <p>CS Student & Developer — Portfolio OS</p>
          </div>
        </div>

        <div className="tablet-app-grid">
          {APPS.map((app) => (
            <MobileAppIcon
              key={app.id}
              icon={app.icon}
              label={app.label}
              color={app.color}
              onClick={() => openApp(app.id)}
            />
          ))}
          <MobileAppIcon
            icon={MusicNoteIcon}
            label={isPlaying ? 'Pause' : 'Music'}
            color={isPlaying ? '#50fa7b' : '#555'}
            onClick={toggleMusic}
          />
        </div>
      </div>


      {renderModal()}
    </div>
  );
}

export default TabletLayout;
