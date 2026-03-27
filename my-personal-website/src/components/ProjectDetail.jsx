import React, { useState, useRef, useCallback } from 'react';

function ProjectDetail({ project }) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const touchStartRef = useRef(null);

  if (!project) {
    return <div className="readme-empty">No project selected.</div>;
  }

  const nextItem = () => setCurrentItemIndex((i) => (i + 1) % project.media.length);
  const prevItem = () => setCurrentItemIndex((i) => (i - 1 + project.media.length) % project.media.length);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current;
    const minSwipe = 50;
    if (Math.abs(dx) >= minSwipe) {
      if (dx < 0) nextItem();
      else prevItem();
    }
    touchStartRef.current = null;
  };

  // Split description: first 2 items are the overview, rest are details
  const overview = project.description.slice(0, 2);
  const details = project.description.slice(2);

  return (
    <div className="readme">
      {/* Header */}
      <div className="readme-header">
        <h1>{project.title}</h1>
        <p className="readme-summary">{project.summary}</p>
      </div>

      {/* Tech badges */}
      <div className="readme-badges">
        {project.technologies.map((tech, i) => (
          <span key={i} className="readme-badge">{tech}</span>
        ))}
      </div>

      <hr className="readme-divider" />

      {/* Screenshots section */}
      <h2 className="readme-section-title">Screenshots</h2>
      <div className="readme-media">
        <div
          className="media-carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {project.media.length > 1 && (
            <button onClick={prevItem} className="carousel-arrow left">&lt;</button>
          )}
          <div className="media-wrapper" style={{ transform: `translateX(-${currentItemIndex * 100}%)` }}>
            {project.media.map((item, index) => (
              <div key={index} className="media-item">
                {item.type === 'image' ? (
                  <img src={item.url} alt={`${project.title} - ${index + 1}`} className="pane-image" />
                ) : (
                  <video src={item.url} controls className="pane-video">
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ))}
          </div>
          {project.media.length > 1 && (
            <button onClick={nextItem} className="carousel-arrow right">&gt;</button>
          )}
        </div>
        {project.media.length > 1 && (
          <div className="readme-media-dots">
            {project.media.map((_, i) => (
              <span
                key={i}
                className={`readme-dot ${i === currentItemIndex ? 'active' : ''}`}
                onClick={() => setCurrentItemIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      <hr className="readme-divider" />

      {/* Overview callout */}
      <div className="readme-callout tip">
        <div className="readme-callout-title">Overview</div>
        <ul className="readme-list">
          {overview.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Features */}
      {details.length > 0 && (
        <>
          <h2 className="readme-section-title">Features</h2>
          <ul className="readme-list">
            {details.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </>
      )}

      {/* Tech stack */}
      <hr className="readme-divider" />
      <h2 className="readme-section-title">Tech Stack</h2>
      <div className="readme-callout note">
        <div className="readme-callout-title">Built with</div>
        <div className="readme-tech-grid">
          {project.technologies.map((tech, i) => (
            <code key={i} className="readme-tech-item">{tech}</code>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
