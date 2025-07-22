import React from 'react';

const Skills = React.forwardRef((props, ref) => (
  <section id="skillsSection" ref={ref}>
    <div className="skills-content">
      <div className="skillsText">
        <h2>Skills</h2>
      </div>
    </div>
  </section>
));

export default Skills;
