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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

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

const DOCK_ITEMS_IDS = ['about', 'projects', 'contact', 'github'];

function MobileLayout() {
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

        <div className="mobile-app-grid">
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


    </div>
  );
}

/* ---- Mobile Projects (tap-to-open, no desktop context needed) ---- */
function MobileProjects({ onOpenProject }) {
  // Import project data directly
  const projectsData = [
    {
      title: 'AWS One Day Proof of Concept',
      filename: 'aws_poc.proj',
      summary: 'An AI-powered proof-of-concept generator that transforms business ideas into comprehensive analyses.',
      technologies: ['React', 'Python', 'Flask', 'LLaMA'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic1.png` }],
      description: [
        'Developed a full-stack web application for AI-driven business concept validation.',
        'Generates detailed reports: risk assessments, use cases, stakeholder analysis.',
        'Features real-time chat for iterative concept refinement.',
      ],
    },
    {
      title: 'Found in Translation',
      filename: 'translation_app.proj',
      summary: 'A multi-modal translation app with speech-to-text, sign language recognition, and real-time translation.',
      technologies: ['Flutter', 'Python', 'OpenCV', 'MediaPipe'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/HandSignProject/Pic1.png` }],
      description: [
        'Built a Flutter-based mobile app for accessible, multi-modal translation.',
        'Supports speech input, sign language recognition, and real-time translation.',
      ],
    },
    {
      title: 'Face Detection and Recognition',
      filename: 'face_recognition.proj',
      summary: 'An advanced deep learning-based face recognition app with real-time detection.',
      technologies: ['Python', 'OpenCV', 'DeepFace', 'PyTorch'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/FaceRecProject/Pic1.png` }],
      description: [
        'Developed a dual-mode face recognition platform for real-time and batch video analysis.',
        'Core system uses OpenCV YuNet and DeepFace with VGG-Face, FaceNet, and ArcFace.',
      ],
    },
    {
      title: 'Car Make & Model Recognition',
      filename: 'car_recognition.proj',
      summary: 'A Python-based desktop app using deep learning to recognize car makes and models.',
      technologies: ['Python', 'PyTorch', 'ResNet-34'],
      media: [{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/CarProject/Pic1.jpg` }],
      description: [
        'Built a Tkinter-based desktop GUI for car image upload and recognition.',
        'Core ML engine uses a fine-tuned ResNet-34 CNN.',
      ],
    },
  ];

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
