import React from 'react';

const coreTechnologies = [
  'Python', 'C++', 'SQL', 'TypeScript',
  'pandas', 'NumPy', 'PyTorch', 'LightGBM', 'XGBoost', 'scikit-learn', 'SHAP', 'YOLOv8',
  'pybind11', 'CUDA', 'Docker', 'AWS', 'Oracle Cloud', 'Linux', 'Git', 'GitHub Actions',
  'FastAPI', 'React',
];

const mlProjects = [
  {
    name: 'Innoverv',
    detail:
      'Built and deployed a production classification system for SAP S/4HANA cash clearing, processing 20,000+ monthly cash transactions and cutting manual matching by 70%. LightGBM selected over Random Forest and XGBoost on out-of-sample F1 (94%), with SHAP explanations so finance staff could see why each transaction matched.',
  },
  {
    name: 'Clearway',
    detail:
      'A real-time anomaly-detection system that fuses TfL bus predictions, road-disruption feeds and JamCam street imagery, with YOLOv8 object detection, to flag where official forecasts diverge from observed conditions.',
  },
  {
    name: "King's Undergraduate Research Fellowship",
    detail:
      'Optimised a real-time face recognition pipeline for identifying missing persons in open databases; 30% throughput gain through frame batching and multiprocessing, 97% recognition accuracy.',
  },
  {
    name: 'Stanford Cars classifier',
    detail:
      'ResNet34 transfer-learning classifier on the Stanford Cars dataset, 92% accuracy, CUDA acceleration cutting training time by 95%.',
  },
  {
    name: 'Sign language to speech',
    detail:
      'Real-time sign language to speech translator combining MediaPipe and Whisper; hackathon winner.',
  },
];

function About() {
  return (
    <div className="about-inner">
      <div className="about-content">
        <div>
          <h2>About Me</h2>
          <p>Hi there! I'm Alexey.</p>
          <p>
            I build production machine learning and trading infrastructure in
            Python and C++.
          </p>
          <p>
            MSci Computer Science at King's College London, expected First Class
            Honours, 2027, with foundations in linear algebra, calculus,
            probability and statistics.
          </p>
        </div>
        <div className="profile-picture">
          <img
            src={`${import.meta.env.BASE_URL}assets/images/ProfilePicture.jpg`}
            alt="ProfilePic"
          />
        </div>
      </div>

      <div className="about-sections">
        <section className="about-section">
          <h3>Currently building</h3>
          <p>
            Counterback, an open-source execution-realistic limit order book
            backtesting engine: full order-book reconstruction and
            price-time-priority matching, a C++ matching core via pybind11, and
            fill models from mid-spread to queue-position simulation. Its Binance
            depth-recording pipeline is already deployed in Docker on AWS and
            Oracle Cloud. The engine is the evaluation harness for a King's
            College London Finance Hub research collaboration on DiffLOB, the
            group's generative limit order book model, testing whether
            adversarial trading agents can exploit artefacts in generated
            markets.
          </p>
        </section>

        <section className="about-section">
          <h3>Machine learning, research to deployment</h3>
          <ul className="about-list">
            {mlProjects.map((project) => (
              <li key={project.name}>
                <strong>{project.name}</strong> — {project.detail}
              </li>
            ))}
          </ul>
        </section>

        <section className="about-section">
          <h3>Competitions</h3>
          <p>
            Prize-winner at Citadel's Terminal live algorithmic trading
            competition: $1,000 against 100+ competitors in a head-to-head event
            at Citadel's London office.
          </p>
        </section>

        <section className="about-section">
          <h3>Core technologies</h3>
          <div className="about-tags">
            {coreTechnologies.map((tech) => (
              <span key={tech} className="about-tag">{tech}</span>
            ))}
          </div>
        </section>

        <p className="about-footer">
          <a
            href="https://github.com/AKhromin"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            github.com/AKhromin
          </a>
          <span className="about-footer-sep">·</span>
          Explore the icons to see my skills, projects and experience!
        </p>
      </div>
    </div>
  );
}

export default About;
