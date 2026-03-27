import React from 'react';

const educationData = [
  {
    school: 'City of London Freemens School',
    filename: 'freemens_school.edu',
    dates: '2020 - 2023',
    degree: 'A-levels: Mathematics, Further Mathematics, Computer Science, Physics',
    logoUrl: `${import.meta.env.BASE_URL}assets/images/FreemensLogo.jpg`,
  },
  {
    school: "King's College London",
    filename: 'kings_college.edu',
    dates: '2023 - 2027',
    degree: 'Master of Science in Computer Science',
    logoUrl: `${import.meta.env.BASE_URL}assets/images/KCLLogo.jpg`,
  },
];

function Education() {
  return (
    <div className="folder-view">
      <div className="edu-list">
        {educationData.map((edu, index) => (
          <div key={index} className="edu-card">
            <div className="edu-icon-area">
              <div className="edu-icon-thumb">
                <img src={edu.logoUrl} alt={`${edu.school} logo`} />
                <span className="edu-icon-ext">.edu</span>
              </div>
              <span className="edu-icon-filename">{edu.filename}</span>
            </div>
            <div className="edu-card-info">
              <h3>{edu.school}</h3>
              <p className="edu-dates">{edu.dates}</p>
              <p className="edu-degree">{edu.degree}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Education;
