import React, { useMemo } from 'react';

const skillsData = {
  languages: ["Python", "Java", "JavaScript", "R", "Scala", "C++", "Haskell", "Prolog", "HTML/CSS", "SQL"],
  libraries_and_frameworks: ["PyTorch", "Scikit-Learn", "OpenCV & DeepFace", "MatPlotLib", "NumPy & Pandas", "TensorFlow", "React", "Node.js", "Flutter", "Flask"],
  tools_and_platforms: ["Git & GitHub", "Amazon Web Services (AWS)", "Firebase", "CUDA", "Docker", "Linux/Unix", "Postman", "Google Cloud Platform (GCP)", "Ollama"]
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
          <span className="json-meta">{Object.values(skillsData).flat().length} skills</span>
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
