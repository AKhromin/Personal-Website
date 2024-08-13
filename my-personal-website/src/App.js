import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const form = useRef();

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: 'smooth'
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_zq1eerv', 'template_g1xeycw', form.current, 'R0izA26l_3RiWsCEU')
      .then((result) => {
        console.log(result.text);
        form.current.reset(); // Clear the form fields
        toast.success('Email sent successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }, (error) => {
        console.log(error.text);
        toast.error('Failed to send email. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className="App">
      <ToastContainer />
      <div className="top-bar">

        <div className="buttons">
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection(aboutRef); }} className="about">ABOUT</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection(projectsRef); }} className="projects">PROJECTS</a>
          <a href="#education" onClick={(e) => { e.preventDefault(); scrollToSection(educationRef); }} className="education">EDUCATION</a>
          <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection(skillsRef); }} className="skills">SKILLS</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection(contactRef); }} className="contact">CONTACT</a>
        
        </div>
      </div>

      <section id="aboutSection" ref={aboutRef}>
        <div class="about-content">

          <div class="aboutText">
            <h2>About Me</h2>
            <p>Hello! My name is Alexey. Welcome to my personal website. Here you can find information about my projects, education, skills, and how to contact me.</p>
          </div>

          <div class="profile-picture">
            <img src="/assets/images/ProfilePicture.jpg" alt="ProfilePic"/>
          </div>

        </div>
      </section>

      <section id="projectsSection" ref={projectsRef}>
        <div className="projectsText">
          <h2>Projects</h2>
        </div>

        <div className="timeline">

          <div className="timeline-item left">
            <div className="content">
              <h3>Example 1</h3>
              <p>Details about Example 1.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="content">
              <h3>Example 2</h3>
              <p>Details about Example 2.</p>
            </div>
          </div>

        </div>
      </section>

      <section id="educationSection" ref={educationRef}>
        <h2>Education</h2>
        <p>Details about education.</p>
      </section>

      <section id="skillsSection" ref={skillsRef}>
        <h2>Skills</h2>
      </section>
      
      <section id="contactSection" ref={contactRef}>
        <h2>Contact</h2>
        <form ref={form} onSubmit={sendEmail}>
          <label>Your Email</label>
          <input type="email" name="user_email" required />
          <label>Message</label>
          <textarea name="message" required />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
}

export default App;