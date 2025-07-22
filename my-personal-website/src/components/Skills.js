import React from 'react';

const Skills = React.forwardRef((props, ref) => (
  <section id="skillsSection" ref={ref}>
    <div className="skillsText">
      <h2>Skills</h2>
    </div>
    <div className="skills-content">
      <div className="skills-columns">
        <div className="skill-column">
          <h3>Languages</h3>
          <ul>
            <li>JavaScript</li>
            <li>Python</li>
            <li>Java</li>
            <li>C++</li>
            <li>HTML/CSS</li>
            <li>SQL</li>
          </ul>
        </div>
        <div className="skill-column">
          <h3>Libraries & Frameworks</h3>
          <ul>
            <li>React</li>
            <li>Node.js</li>
            <li>Express</li>
            <li>NumPy & Pandas</li>
            <li>TensorFlow</li>
            <li>SCSS</li>
          </ul>
        </div>
        <div className="skill-column">
          <h3>Tools & Platforms</h3>
          <ul>
            <li>Git & GitHub</li>
            <li>Docker</li>
            <li>VS Code</li>
            <li>Jira & Confluence</li>
            <li>Figma</li>
            <li>Firebase</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
));

export default Skills;
