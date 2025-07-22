import React from 'react';

const educationData = [
  {
    school: "City of London Freemens School",
    dates: "2020 - 2023",
    degree: "A-levels: Mathematics, Further Mathematics, Computer Science, Physics",
    logoUrl: `${process.env.PUBLIC_URL}/assets/images/FreemensLogo.jpg`
  },
  {
    school: "King's College London",
    dates: "2023 - 2027",
    degree: "Master of Science in Computer Science",
    logoUrl: `${process.env.PUBLIC_URL}/assets/images/KCLLogo.jpg`
  }
];

const Education = React.forwardRef((props, ref) => (
  <section id="educationSection" ref={ref}>
    <div className="education-content">
      <div className="educationText">
        <h2>Education</h2>
      </div>
      
      <div className="horizontal-timeline">
        {educationData.map((edu, index) => (
          <div key={index} className="timeline-item-horizontal">
            <div className="timeline-content-horizontal">
              <img src={edu.logoUrl} alt={`${edu.school} logo`} className="education-logo" />
              <h3>{edu.school}</h3>
              <p className="timeline-dates">{edu.dates}</p>
              <p>{edu.degree}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

export default Education;
