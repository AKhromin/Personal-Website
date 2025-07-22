import React from 'react';

const About = React.forwardRef((props, ref) => (
  <section id="aboutSection" ref={ref}>
    <div className="about-content">
      <div className="aboutText">
        <h1>About Me</h1>
        <p>Hello! My name is Alexey. Welcome to my personal website. Here you can find information about my projects, education, skills, and how to contact me.</p>
      </div>
      <div className="profile-picture">
        <img src={`${process.env.PUBLIC_URL}/assets/images/ProfilePicture.jpg`} alt="ProfilePic"/>
      </div>
    </div>
  </section>
));

export default About;
