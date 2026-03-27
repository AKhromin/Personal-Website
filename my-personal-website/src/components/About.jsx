import React from 'react';

function About() {
  return (
    <div className="about-inner">
      <div className="about-content">
        <div>
          <h2>About Me</h2>
          <p>Hi there! I'm Alexey</p>
          <p>
            I'm a builder at heart who turns complex AI challenges into elegant
            solutions. With expertise in computer vision, deep learning, and
            full-stack development, I create software that makes a meaningful
            difference in financial services. I'm driven by the belief that
            thoughtful engineering can solve our most pressing problems.
          </p>
          <p>
            Currently I am a passionate third-year Computer Science student at
            King's College London specializing in AI-driven software engineering
            and data analysis.
          </p>
          <p>
            With expertise in deep learning, computer vision, and full-stack
            development, I create software that makes a meaningful difference in
            various domains.
          </p>
          <p>Click on the desktop icons to explore my skills, projects, and experiences!</p>
        </div>
        <div className="profile-picture">
          <img
            src={`${import.meta.env.BASE_URL}assets/images/ProfilePicture.jpg`}
            alt="ProfilePic"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
