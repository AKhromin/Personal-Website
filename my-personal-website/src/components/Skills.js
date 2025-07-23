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
            <li>Python</li>
            <li>Java</li>
            <li>JavaScript</li>
            <li>R</li>
            <li>Scala</li>
            <li>C++</li>
            <li>Haskell</li>
            <li>Prolog</li>
            <li>HTML/CSS</li>
            <li>SQL</li>
          </ul>
        </div>
        <div className="skill-column">
          <h3>Libraries & Frameworks</h3>
          <ul>
            <li>PyTorch</li>
            <li>Scikit-Learn</li>
            <li>OpenCV & DeepFace</li>
            <li>MatPlotLib</li>
            <li>NumPy & Pandas</li>
            <li>TensorFlow</li>
            <li>React</li>
            <li>Node.js</li>
            <li>Flutter</li>
            <li>Flask</li>
          </ul>
        </div>
        <div className="skill-column">
          <h3>Tools & Platforms</h3>
          <ul>
            <li>Git & GitHub</li>
            <li>Amazon Web Services (AWS)</li>
            <li>Firebase</li>
            <li>CUDA</li>
            <li>Docker</li>
            <li>Linux/Unix</li>
            <li>Postman</li>
            <li>Google Cloud Platform (GCP)</li>
            <li>Ollama</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
));

export default Skills;
