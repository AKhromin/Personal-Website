import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import About from './components/About';
import Projects from './components/Projects';
import Education from './components/Education';
import Skills from './components/Skills';
import Contact from './components/Contact';

function App() {
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const topBarRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-left');
        } else {
          entry.target.classList.remove('fade-in-left');
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('[class$="-content"]').forEach(section => {
      observer.observe(section);
    });
  
    return () => {
      document.querySelectorAll('[class$="-content"]').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (topBarRef.current) {
        const stickyPoint = topBarRef.current.offsetTop;
        if (window.scrollY > stickyPoint) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }

      // Highlight active section
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sections = {
        about: aboutRef,
        projects: projectsRef,
        education: educationRef,
        skills: skillsRef,
        contact: contactRef,
      };
      let currentSection = '';
      Object.entries(sections).forEach(([name, ref]) => {
        if (ref.current && scrollPosition >= ref.current.offsetTop) {
          currentSection = name;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <div className="App">
      <ToastContainer />
      <div ref={topBarRef} className={`top-bar ${isSticky ? 'sticky' : ''}`}>
        <div className="buttons">
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection(aboutRef); }} className={`nav-button ${activeSection === 'about' ? 'active' : ''}`}>ABOUT</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection(projectsRef); }} className={`nav-button ${activeSection === 'projects' ? 'active' : ''}`}>PROJECTS</a>
          <a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection(educationRef); }} className={`nav-button ${activeSection === 'education' ? 'active' : ''}`}>EDUCATION</a>
          <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection(skillsRef); }} className={`nav-button ${activeSection === 'skills' ? 'active' : ''}`}>SKILLS</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection(contactRef); }} className={`nav-button ${activeSection === 'contact' ? 'active' : ''}`}>CONTACT</a>
        </div>
      </div>
      {isSticky && <div className="top-bar-placeholder" />}

      <About ref={aboutRef} />
      <Projects ref={projectsRef} />
      <Education ref={educationRef} />
      <Skills ref={skillsRef} />
      <Contact ref={contactRef} />
  
    </div>
  );
}

export default App;