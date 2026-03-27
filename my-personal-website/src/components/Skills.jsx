import React from 'react';

const skillsData = {
  languages: ["Python", "Java", "JavaScript", "R", "Scala", "C++", "Haskell", "Prolog", "HTML/CSS", "SQL"],
  libraries_and_frameworks: ["PyTorch", "Scikit-Learn", "OpenCV & DeepFace", "MatPlotLib", "NumPy & Pandas", "TensorFlow", "React", "Node.js", "Flutter", "Flask"],
  tools_and_platforms: ["Git & GitHub", "Amazon Web Services (AWS)", "Firebase", "CUDA", "Docker", "Linux/Unix", "Postman", "Google Cloud Platform (GCP)", "Ollama"]
};

function JsonString({ value }) {
  return <span className="json-string">"{value}"</span>;
}

function JsonArray({ items, indent }) {
  if (items.length === 0) return <span className="json-bracket">[]</span>;
  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);
  return (
    <>
      <span className="json-bracket">[</span>{'\n'}
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {innerPad}<JsonString value={item} />
          {i < items.length - 1 ? <span className="json-comma">,</span> : null}{'\n'}
        </React.Fragment>
      ))}
      {pad}<span className="json-bracket">]</span>
    </>
  );
}

function Skills() {
  const entries = Object.entries(skillsData);
  return (
    <div className="skills-inner">
      <div className="json-viewer">
        <div className="json-toolbar">
          <span className="json-filename">skills.json</span>
          <span className="json-meta">{Object.values(skillsData).flat().length} skills</span>
        </div>
        <div className="json-line-numbers" aria-hidden="true">
          {Array.from({ length: 35 }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <pre className="json-code"><code>
{'{\n'}
{entries.map(([key, values], idx) => (
  <React.Fragment key={key}>
    {'  '}<span className="json-key">"{key}"</span><span className="json-colon">:</span>{' '}
    <JsonArray items={values} indent={1} />
    {idx < entries.length - 1 ? <span className="json-comma">,</span> : null}{'\n'}
  </React.Fragment>
))}
{'}'}
        </code></pre>
      </div>
    </div>
  );
}

export default Skills;
