import React from 'react';

const Education = React.forwardRef((props, ref) => (
  <section id="educationSection" ref={ref}>
    <div className="education-content">
      <div className="educationText">
        <h2>Education</h2>
        <p>Details about education.</p>
      </div>
    </div>
  </section>
));

export default Education;
