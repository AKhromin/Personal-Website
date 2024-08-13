import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const form = useRef();

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
        <div className="oval-background">
          <div className="buttons">
            <a href="#about">ABOUT</a>
            <a href="#projects">PROJECTS</a>
            <a href="#education">EDUCATION</a>
            <a href="#skills">SKILLS</a>
            <a href="#contact">CONTACT</a>
          </div>
        </div>
      </div>
      <section id="about">
        <h2>About Me</h2>
        <p>Hello! My name is Alexey. Welcome to my personal website. Here you can find information about my projects, education, skills, and how to contact me.</p>
      </section>
      <section id="projects">
        <h2>Projects</h2>
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
      <section id="education">
        <h2>Education</h2>
        <p>Details about education.</p>
      </section>
      <section id="skills">
        <h2>Skills</h2>
      </section>
      <section id="contact">
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