import React, { useState } from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useDesktop } from '../context/DesktopContext';
import projectsData from '../data/projectsData';

function Projects() {
  const { openProject } = useDesktop();
  const [isListView, setIsListView] = useState(false);

  return (
    <div className="folder-view projects-folder">
      <div className="projects-view-toggle" role="group" aria-label="Project view">
        <button type="button" aria-pressed={!isListView} onClick={() => setIsListView(false)}>
          <GridViewIcon fontSize="inherit" />
          Grid
        </button>
        <button type="button" aria-pressed={isListView} onClick={() => setIsListView(true)}>
          <ViewListIcon fontSize="inherit" />
          List
        </button>
      </div>
      <div className={isListView ? 'projects-grid list-view' : 'projects-grid'}>
        {projectsData.map((project) => (
          <button
            key={project.filename}
            className="project-card"
            onClick={() => openProject(project)}
          >
            <div className="project-card-thumb">
              {project.media[0] && (
                <img src={project.media[0].url} alt={project.title} />
              )}
              {project.media.length === 0 && project.mediaPlaceholder && (
                <span className="project-media-placeholder">{project.mediaPlaceholder}</span>
              )}
              <span className="project-card-ext">.proj</span>
            </div>
            <div className="project-card-info">
              <span className="project-card-name">{project.filename}</span>
              <p className="project-card-summary">{project.summary}</p>
              <div className="project-card-tags">
                {project.technologies.slice(0, 5).map((tech, i) => (
                  <span key={i} className="project-card-tag">{tech}</span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Projects;
