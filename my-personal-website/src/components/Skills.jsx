import React, { useMemo } from 'react';

const skillsData = {
  top_skills: ["Python (Programming Language)", "C++", "Machine Learning", "Data Science", "Quantitative Finance"],
  languages: ["Python", "C++", "TypeScript", "SQL", "Scala", "Java", "JavaScript", "R", "Haskell", "Prolog", "HTML/CSS"],
  machine_learning_and_data: ["Machine Learning", "Data Science", "Data Engineering", "Computer Vision", "Facial Recognition", "Face Detection", "Hand Detection", "Speech Recognition", "Speech Communications", "Generative Adversarial Networks (GANs)", "Dimensionality Reduction", "Generalized Linear Models"],
  quantitative_finance: ["Quantitative Finance", "Market Microstructure", "Limit Order Book", "Backtesting", "Monte Carlo Simulation", "Financial Analysis"],
  mathematics_and_statistics: ["Probability and Statistics", "Linear Algebra", "Mathematics"],
  libraries_and_frameworks: ["PyTorch", "Scikit-Learn", "XGBoost", "LightGBM", "SHAP", "NumPy", "Pandas (Software)", "MatPlotLib", "TensorFlow", "OpenCV & DeepFace", "React.js", "Node.js", "Flutter", "Flask"],
  tools_and_platforms: ["Git", "GitHub", "Docker", "Linux", "Amazon Web Services (AWS)", "CUDA", "Firebase", "Google Cloud Platform (GCP)", "Postman", "Ollama"],
  software_engineering: ["Algorithm Design", "Algorithm Development", "Object-Oriented Programming (OOP)", "Unified Modeling Language (UML)"],
  professional: ["Analytical Skills", "Teamwork"]
};

// Build each line as { text, tokens } so line numbers always match 1:1
function buildJsonLines() {
  const entries = Object.entries(skillsData);
  const lines = [];

  lines.push({ tokens: [{ type: 'bracket', text: '{' }] });

  entries.forEach(([key, values], idx) => {
    // key: [
    lines.push({
      tokens: [
        { type: 'plain', text: '  ' },
        { type: 'key', text: `"${key}"` },
        { type: 'colon', text: ':' },
        { type: 'plain', text: ' ' },
        { type: 'bracket', text: '[' },
      ],
    });

    // each value
    values.forEach((val, i) => {
      const tok = [
        { type: 'plain', text: '    ' },
        { type: 'string', text: `"${val}"` },
      ];
      if (i < values.length - 1) tok.push({ type: 'comma', text: ',' });
      lines.push({ tokens: tok });
    });

    // closing ]  or  ],
    const closeTok = [
      { type: 'plain', text: '  ' },
      { type: 'bracket', text: ']' },
    ];
    if (idx < entries.length - 1) closeTok.push({ type: 'comma', text: ',' });
    lines.push({ tokens: closeTok });
  });

  lines.push({ tokens: [{ type: 'bracket', text: '}' }] });

  return lines;
}

const TOKEN_CLASS = {
  key: 'json-key',
  string: 'json-string',
  bracket: 'json-bracket',
  colon: 'json-colon',
  comma: 'json-comma',
  plain: '',
};

function Skills() {
  const jsonLines = useMemo(() => buildJsonLines(), []);

  return (
    <div className="skills-inner">
      <div className="json-viewer">
        <div className="json-toolbar">
          <span className="json-filename">skills.json</span>
          <span className="json-meta">{new Set(Object.values(skillsData).flat()).size} skills</span>
        </div>
        <div className="json-body">
          {jsonLines.map((line, i) => (
            <div key={i} className="json-line">
              <span className="json-line-num">{i + 1}</span>
              <span className="json-line-content">
                {line.tokens.map((tok, j) => {
                  const cls = TOKEN_CLASS[tok.type];
                  return cls
                    ? <span key={j} className={cls}>{tok.text}</span>
                    : <span key={j}>{tok.text}</span>;
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
