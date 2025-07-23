import React from 'react';

const About = React.forwardRef((props, ref) => (
  <section id="aboutSection" ref={ref}>
    <div className="about-content">
      <div>
        <div className="aboutText">
          <h2>About Me</h2>
        </div>

        <div className="aboutMeContent">
          <p>Hi there! I'm Alexey</p> 
          <p>I'm a builder at heart who turns complex AI challenges into elegant solutions. With expertise in computer vision, deep learning, and full-stack development, I create software that makes a meaningful difference in financial services. I'm driven by the belief that thoughtful engineering can solve our most pressing problems.</p>

          <p>Currently I am a passionate third-year Computer Science student at King's College London with a love for building creative and functional web applications.</p>
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
