import React from 'react';
import { useDesktop } from '../context/DesktopContext';
import projectsData from '../data/projectsData';

function Projects() {
  const { openProject } = useDesktop();

  return (
    <div className="folder-view projects-folder">
      <div className="projects-grid">
        {projectsData.map((project, index) => (
          <button
            key={index}
            className="project-card"
            onClick={() => openProject(project)}
          >
            <div className="project-card-thumb">
              {project.media[0] && (
                <img src={project.media[0].url} alt={project.title} />
              )}
              <span className="project-card-ext">.proj</span>
            </div>
            <span className="project-card-name">{project.filename}</span>
            <p className="project-card-summary">{project.summary}</p>
            <div className="project-card-tags">
              {project.technologies.slice(0, 5).map((tech, i) => (
                <span key={i} className="project-card-tag">{tech}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Projects;
