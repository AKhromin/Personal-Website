import React from 'react';
import { useDesktop } from '../context/DesktopContext';

const projectsData = [
  {
    title: 'AWS One Day Proof of Concept',
    filename: 'aws_poc.proj',
    summary:
      'An AI-powered proof-of-concept generator that transforms business ideas into comprehensive analyses, AWS architecture diagrams, and interactive demos.',
    description: [
      'Developed a full-stack web application for AI-driven business concept validation.',
      'Generates detailed reports: risk assessments, use cases, stakeholder analysis, recommendations, and timelines.',
      'Features real-time chat for iterative concept refinement and persistent history with user authentication.',
      'Automates AWS architecture diagram creation for multiple application types (e-commerce, social networks, AR games, etc.).',
      'Produces interactive HTML/CSS mockups for quick demo visualization.',
      'Built with React (frontend) and Python backend using fine-tuned LLaMA models for NLP.',
      'Implements lightweight, local model execution per client requirements for rapid prototyping.',
    ],
    technologies: [
      'React', 'Python', 'Flask', 'LLaMA', 'PlantUML', 'Node.js', 'CSS3', 'HTML5', 'Jest', 'Axios', 'JWT',
    ],
    media: [
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic1.png` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic2.png` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic3.png` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic4.png` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic5.png` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AWSProject/Pic6.png` },
    ],
  },
  {
    title: 'Found in Translation',
    filename: 'translation_app.proj',
    summary:
      'A multi-modal translation application with speech-to-text, sign language recognition, and real-time translation capabilities.',
    description: [
      'Built a Flutter-based mobile app for accessible, multi-modal translation.',
      'Supports speech input, sign language recognition, and real-time translation.',
      'Backend powered by Python Flask, handling AI inference and translation tasks.',
      'Uses OpenAI Whisper for speech-to-text and Google Translate API for multi-language translation.',
      'Implements MediaPipe-based computer vision for real-time hand gesture detection and sign language interpretation.',
      'Offers text-to-speech output for accessible translated audio.',
      'Real-time audio processing enables spoken input and instant translated audio output.',
      'Designed for cross-cultural communication and inclusivity, breaking down language barriers.',
    ],
    technologies: [
      'Flutter', 'Python', 'Flask', 'OpenCV', 'MediaPipe', 'OpenAI Whisper', 'Google Translate API',
      'Google Text-to-speech', 'Pygame', 'NumPy', 'Pickle', 'REST API',
    ],
    media: [
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/HandSignProject/Pic1.png` },
      { type: 'video', url: `${import.meta.env.BASE_URL}assets/images/HandSignProject/Vid1.mov` },
    ],
  },
  {
    title: 'Face Detection and Recognition',
    filename: 'face_recognition.proj',
    summary:
      'An advanced deep learning-based face recognition app with real-time detection, identification, and tracking across single and multi-video modes.',
    description: [
      'Developed a dual-mode face recognition platform for real-time and batch video analysis.',
      'Single video mode: interactive Tkinter GUI for known/unknown face recognition, real-time detection overlays, person tracking, and configurable appearance/disappearance detection.',
      'Multi-video mode: batch processing of multiple videos against a target face image with selective time-range analysis; ideal for surveillance and content review.',
      'Core system uses OpenCV YuNet for detection and DeepFace with VGG-Face, FaceNet, and ArcFace models for facial embeddings.',
      'Implements GPU acceleration (CUDA), multi-scale embeddings, and cosine similarity matching with adjustable thresholds.',
      'Generates detailed CSV logs and visualization reports (appearance frequency charts, duration summaries, face thumbnails).',
      'Supports MP4, AVI, MOV video formats and PNG, JPG, JPEG image formats; uses frame skipping for performance.',
      'Modular architecture enables easy integration into other applications or automated workflows.',
    ],
    technologies: [
      'Python', 'OpenCV', 'DeepFace', 'Tkinter', 'NumPy', 'Pandas', 'Matplotlib', 'PIL/Pillow',
      'PyTorch', 'SciPy', 'Threading', 'Multiprocessing', 'CUDA', 'YuNet Face Detector', 'VGG-Face',
      'FaceNet', 'ArcFace',
    ],
    media: [
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/FaceRecProject/Pic1.png` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/FaceRecProject/Pic2.png` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/FaceRecProject/Pic3.png` },
    ],
  },
  {
    title: 'Car Make & Model Recognition',
    filename: 'car_recognition.proj',
    summary:
      'A Python-based desktop application that uses deep learning to automatically recognize car makes and models from uploaded images.',
    description: [
      'Built a Tkinter-based desktop GUI for easy car image upload, recognition, and results management.',
      'Core ML engine uses a fine-tuned ResNet-34 CNN (pre-trained on ImageNet, trained on the Stanford Cars Dataset with 196 classes).',
      'Implements PyTorch-based preprocessing: image resizing (400x400), tensor conversion, and normalization for optimal performance.',
      'Provides predicted make/model with confidence scores, applying a 70% threshold for reliable identification.',
      'Supports multiple image formats (JPEG, JPG, PNG, BMP) with validation for quality and resolution.',
      'Features organized file management, saving recognized images in categorized folders by car make.',
      'Cleanly separates UI layer, ML backend, training, and inference modules for maintainability.',
      'Training pipeline supports ResNet-34 fine-tuning with SGD optimization and learning rate scheduling.',
      'Offers customizable output directories, comprehensive settings menu, and robust error handling.',
      'Designed to make advanced computer vision accessible for practical car identification tasks.',
    ],
    technologies: [
      'Python', 'Tkinter', 'PyTorch', 'torchvision', 'ResNet-34', 'PIL/Pillow', 'NumPy', 'Pandas',
      'Matplotlib', 'OpenCV', 'JSON', 'OS', 'Regex', 'datetime', 'IPython',
    ],
    media: [
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/CarProject/Pic1.jpg` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/CarProject/Pic2.jpg` },
      { type: 'image', url: `${import.meta.env.BASE_URL}assets/images/CarProject/Pic3.jpg` },
    ],
  },
];

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
