import React from 'react';

const About = React.forwardRef((props, ref) => (
  <section id="aboutSection" ref={ref}>
    <div className="about-content">
      <div>
        <div className="aboutText">
          <h2>About Me</h2>
        </div>

        <div className="aboutMeContent">
          <p>Hi there! I'm Alexey, a passionate third-year Computer Science student at King's College London with a love for building creative and functional web applications.</p>
          <p>When I'm not immersed in code, you can find me exploring the vibrant streets of London, hunting for the city's best coffee, or brainstorming my next personal project. I'm driven by curiosity and a desire to learn and grow, both as a developer and as an individual.</p>
          <p>Feel free to scroll down to learn more about my skills, projects, and experiences!</p>
        </div>
      </div>

      <div className="profile-picture">
        <img src={`${process.env.PUBLIC_URL}/assets/images/ProfilePicture.jpg`} alt="ProfilePic"/>
      </div>
    </div>
  </section>
));

export default About;
