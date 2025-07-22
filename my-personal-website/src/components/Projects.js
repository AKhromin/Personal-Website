// Projects.js - REFACTORED FOR PANE VIEW
import React, { useState } from 'react';

const projectsData = [
  {
    title: 'Project Alpha',
    summary: 'A web application for task management.',
    description: 'Developed a full-stack web application to help teams manage their projects and tasks efficiently. Features include user authentication, real-time updates, and a responsive design. The application is built with a modern technology stack, ensuring scalability and maintainability. The backend is a RESTful API that handles all the business logic and data persistence. The frontend is a single-page application that provides a rich and interactive user experience. We focused on a clean and intuitive UI to make it easy for users to get started and be productive.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    imageUrl: `${process.env.PUBLIC_URL}/assets/images/CityRoad.jpg`
  },
  {
    title: 'Project Beta',
    summary: 'An e-commerce platform for selling handmade goods.',
    description: 'Built a secure and scalable e-commerce website with features like product listings, shopping cart, and payment gateway integration. The platform supports multiple vendors and allows them to manage their own inventory and orders. We implemented a secure checkout process using Stripe to handle payments. The user interface is designed to be visually appealing and easy to navigate, providing a seamless shopping experience for customers. The system also includes an admin dashboard for managing products, users, and orders.',
    technologies: ['React', 'Redux', 'Firebase', 'Stripe'],
    imageUrl: `${process.env.PUBLIC_URL}/assets/images/CityRoad.jpg`
  },
  {
    title: 'Project Gamma',
    summary: 'A mobile app for tracking fitness goals.',
    description: 'Designed and developed a cross-platform mobile app that allows users to track their workouts, set goals, and monitor their progress over time. The app features a variety of workout plans and exercises, with video demonstrations for each. Users can log their activities, track their performance metrics, and view their progress through interactive charts and graphs. The app also includes social features, allowing users to connect with friends and share their achievements. It is built using React Native, which allows for a single codebase to be deployed on both iOS and Android.',
    technologies: ['React Native', 'GraphQL', 'Apollo', 'PostgreSQL'],
    imageUrl: `${process.env.PUBLIC_URL}/assets/images/CityRoad.jpg`
  },
  {
    title: 'Project Delta',
    summary: 'A data visualization dashboard for analytics.',
    description: 'Created a powerful data visualization tool that connects to various data sources and provides interactive charts and graphs for business intelligence. The dashboard allows users to explore complex datasets and gain insights through a variety of visualization types, including bar charts, line graphs, and heatmaps. The tool is highly customizable, allowing users to create their own dashboards and reports. It is built with D3.js for powerful and flexible visualizations, and a Python/Flask backend for data processing and API services. The goal was to make data more accessible and understandable for non-technical users.',
    technologies: ['D3.js', 'React', 'Python', 'Flask'],
    imageUrl: `${process.env.PUBLIC_URL}/assets/images/CityRoad.jpg`
  }
];

const Projects = React.forwardRef((props, ref) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSelectProject = (project) => {
    // If the same project is clicked again, close the pane
    if (selectedProject && selectedProject.title === project.title) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  const closePane = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projectsSection" ref={ref}>
      <div className="projectsText">
        <h2>Projects</h2>
      </div>
      
      <div className="projects-content">
        <div className="timeline-container">
          <div className="timeline">
            {projectsData.map((project, index) => (
              <div
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div
                  className={`content ${selectedProject?.title === project.title ? 'active-project' : ''}`}
                  onClick={() => handleSelectProject(project)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelectProject(project)}
                  tabIndex="0"
                  role="button"
                  aria-label={`Open details for ${project.title}`}
                >
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`details-pane ${selectedProject ? 'is-visible' : ''}`}>
          {selectedProject ? (
            <>
              <button onClick={closePane} className="pane-close-button" aria-label="Close project details">&times;</button>
              <img src={selectedProject.imageUrl} alt={selectedProject.title} className="pane-image" />
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              <div className="technologies">
                {selectedProject.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="pane-placeholder">
              <p>Click on a project from the timeline to see the details here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default Projects;