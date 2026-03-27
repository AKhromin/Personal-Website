import React from 'react';

function AboutPC() {
  return (
    <div className="about-pc">
      <div className="about-pc-logo">AK</div>
      <h2>Portfolio OS</h2>
      <p className="about-pc-version">Version 1.0.0</p>

      <div className="about-pc-specs">
        <div className="about-pc-row">
          <span className="about-pc-label">Built with</span>
          <span className="about-pc-value">React + Vite</span>
        </div>
        <div className="about-pc-row">
          <span className="about-pc-label">Styling</span>
          <span className="about-pc-value">CSS3</span>
        </div>
        <div className="about-pc-row">
          <span className="about-pc-label">Icons</span>
          <span className="about-pc-value">Material UI Icons</span>
        </div>
        <div className="about-pc-row">
          <span className="about-pc-label">Hosting</span>
          <span className="about-pc-value">GitHub Pages</span>
        </div>
        <div className="about-pc-row">
          <span className="about-pc-label">Developer</span>
          <span className="about-pc-value">Alexey Khromin</span>
        </div>
      </div>

      <p className="about-pc-footer">
        Designed to look and feel like a desktop operating system.
      </p>
    </div>
  );
}

export default AboutPC;
