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
          </button>
        ))}
      </div>
    </div>
  );
}

export default Projects;
