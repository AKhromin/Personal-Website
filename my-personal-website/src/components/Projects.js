// Projects.js - REFACTORED FOR PANE VIEW
import React, { useState } from 'react';

const projectsData = [
  {
    title: 'AWS One Day Proof of Concept',
    summary: 'An AI-powered proof-of-concept generator that transforms business ideas into comprehensive analyses, AWS architecture diagrams, and interactive demos.',
    description: [
      'Developed a full-stack web application for AI-driven business concept validation.',
      'Generates detailed reports: risk assessments, use cases, stakeholder analysis, recommendations, and timelines.',
      'Features real-time chat for iterative concept refinement and persistent history with user authentication.',
      'Automates AWS architecture diagram creation for multiple application types (e-commerce, social networks, AR games, etc.).',
      'Produces interactive HTML/CSS mockups for quick demo visualization.',
      'Built with React (frontend) and Python backend using fine-tuned LLaMA models for NLP.',
      'Implements lightweight, local model execution per client requirements for rapid prototyping.'
    ],
    technologies: ['React', 'Python', 'Flask', 'LLaMA', 'PlantUML', 'Node.js', 'CSS3', 'HTML5', 'Jest', 'Axios', 'JWT'],
    media: [
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/AWSProject/Pic1.png` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/AWSProject/Pic2.png` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/AWSProject/Pic3.png` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/AWSProject/Pic4.png` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/AWSProject/Pic5.png` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/AWSProject/Pic6.png` },
    ]
  },
  {
    title: 'Found in Translation',
    summary: 'A multi-modal translation application with speech-to-text, sign language recognition, and real-time translation capabilities.',
    description: [
      'Built a Flutter-based mobile app for accessible, multi-modal translation.',
      'Supports speech input, sign language recognition, and real-time translation.',
      'Backend powered by Python Flask, handling AI inference and translation tasks.',
      'Uses OpenAI Whisper for speech-to-text and Google Translate API for multi-language translation.',
      'Implements MediaPipe-based computer vision for real-time hand gesture detection and sign language interpretation.',
      'Offers text-to-speech output for accessible translated audio.',
      'Real-time audio processing enables spoken input and instant translated audio output.',
      'Designed for cross-cultural communication and inclusivity, breaking down language barriers.'
    ],
    technologies: ['Flutter', 'Python', 'Flask', 'OpenCV', 'MediaPipe', 'OpenAI Whisper', 'Google Translate API', 'Google Text-to-speech', 'Pygame', 'NumPy', 'Pickle', 'REST API'],
    media: [
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/HandSignProject/Pic1.png` },
      { type: 'video', url: `${process.env.PUBLIC_URL}/assets/images/HandSignProject/Vid1.mov` }
    ]
  },
  {
    title: 'Face Detection and Recognition System',
    summary: 'An advanced deep learning-based face recognition app with real-time detection, identification, and tracking across single and multi-video modes.',
    description: [
      'Developed a dual-mode face recognition platform for real-time and batch video analysis.',
      'Single video mode: interactive Tkinter GUI for known/unknown face recognition, real-time detection overlays, person tracking, and configurable appearance/disappearance detection.',
      'Multi-video mode: batch processing of multiple videos against a target face image with selective time-range analysis; ideal for surveillance and content review.',
      'Core system uses OpenCV YuNet for detection and DeepFace with VGG-Face, FaceNet, and ArcFace models for facial embeddings.',
      'Implements GPU acceleration (CUDA), multi-scale embeddings, and cosine similarity matching with adjustable thresholds.',
      'Generates detailed CSV logs and visualization reports (appearance frequency charts, duration summaries, face thumbnails).',
      'Supports MP4, AVI, MOV video formats and PNG, JPG, JPEG image formats; uses frame skipping for performance.',
      'Modular architecture enables easy integration into other applications or automated workflows.'
    ],
    technologies: ['Python', 'OpenCV', 'DeepFace', 'Tkinter', 'NumPy', 'Pandas', 'Matplotlib', 'PIL/Pillow', 'PyTorch', 'SciPy', 'Threading', 'Multiprocessing', 'CUDA', 'YuNet Face Detector', 'VGG-Face', 'FaceNet', 'ArcFace'],
    media: [
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/FaceRecProject/Pic1.png` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/FaceRecProject/Pic2.png` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/FaceRecProject/Pic3.png` }
    ]
  },
  {
    title: 'Car Make and Model Recognition System',
    summary: 'A Python-based desktop application that uses deep learning to automatically recognize car makes and models from uploaded images.',
    description: [
      'Built a Tkinter-based desktop GUI for easy car image upload, recognition, and results management.',
      'Core ML engine uses a fine-tuned ResNet-34 CNN (pre-trained on ImageNet, trained on the Stanford Cars Dataset with 196 classes).',
      'Implements PyTorch-based preprocessing: image resizing (400×400), tensor conversion, and normalization for optimal performance.',
      'Provides predicted make/model with confidence scores, applying a 70% threshold for reliable identification.',
      'Supports multiple image formats (JPEG, JPG, PNG, BMP) with validation for quality and resolution.',
      'Features organized file management, saving recognized images in categorized folders by car make.',
      'Cleanly separates UI layer, ML backend, training, and inference modules for maintainability.',
      'Training pipeline supports ResNet-34 fine-tuning with SGD optimization and learning rate scheduling.',
      'Offers customizable output directories, comprehensive settings menu, and robust error handling.',
      'Designed to make advanced computer vision accessible for practical car identification tasks.'
    ],
    technologies: ['Python', 'Tkinter', 'PyTorch', 'torchvision', 'ResNet-34', 'PIL/Pillow', 'NumPy', 'Pandas', 'Matplotlib', 'OpenCV', 'JSON', 'OS', 'Regex', 'datetime', 'IPython'],
    media: [
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/CarProject/Pic1.jpg` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/CarProject/Pic2.jpg` },
      { type: 'image', url: `${process.env.PUBLIC_URL}/assets/images/CarProject/Pic3.jpg` }
    ]
  }
];

const Projects = React.forwardRef((props, ref) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectProject = (project) => {
    if (selectedProject && selectedProject.title === project.title) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
      setCurrentItemIndex(0); // Reset item index when a new project is selected
    }
  };

  const closePane = () => {
    setSelectedProject(null);
  };

  const nextItem = () => {
    if (selectedProject) {
      setCurrentItemIndex((prevIndex) => (prevIndex + 1) % selectedProject.media.length);
    }
  };

  const prevItem = () => {
    if (selectedProject) {
      setCurrentItemIndex((prevIndex) => (prevIndex - 1 + selectedProject.media.length) % selectedProject.media.length);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const projectsToShow = isExpanded ? projectsData : projectsData.slice(0, 3);

  return (
    <section id="projectsSection" ref={ref}>
      <div className="projectsText">
        <h2>Projects</h2>
      </div>
      <div className="projects-content">
        <div className="timeline-container">
          <div className="timeline">
            {projectsToShow.map((project, index) => (
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
          {projectsData.length > 3 && (
            <div className="more-less-button-container">
              <button onClick={toggleExpanded} className="more-less-button">
                {isExpanded ? 'Less' : 'More'}
              </button>
            </div>
          )}
        </div>
        
        <div className={`details-pane ${selectedProject ? 'is-visible' : 'is-placeholder'}`}>
          {selectedProject ? (
            <>
              <button onClick={closePane} className="pane-close-button" aria-label="Close project details">&times;</button>
              <div className="media-carousel">
                {selectedProject.media.length > 1 && (
                  <button onClick={prevItem} className="carousel-arrow left">&lt;</button>
                )}
                <div className="media-wrapper" style={{ transform: `translateX(-${currentItemIndex * 100}%)` }}>
                  {selectedProject.media.map((item, index) => (
                    <div key={index} className="media-item">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={`${selectedProject.title} - media ${index + 1}`} className="pane-image" />
                      ) : (
                        <video src={item.url} controls className="pane-video">
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
                {selectedProject.media.length > 1 && (
                  <button onClick={nextItem} className="carousel-arrow right">&gt;</button>
                )}
              </div>
              <h2>{selectedProject.title}</h2>
              <div className="project-description">
                {Array.isArray(selectedProject.description) ? (
                  <ul>
                    {selectedProject.description.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{selectedProject.description}</p>
                )}
              </div>
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