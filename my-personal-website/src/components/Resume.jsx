import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useDeviceType from '../hooks/useDeviceType';

const CV_URL = `${import.meta.env.BASE_URL}assets/AlexeyKhrominCV2026.pdf`;
const CV_FILENAME = 'AlexeyKhrominCV2026.pdf';

function Resume() {
  const { isDesktop } = useDeviceType();

  return (
    <div className="resume-inner">
      <div className="resume-toolbar">
        <div className="resume-file">
          <span className="resume-file-badge">PDF</span>
          <div className="resume-file-meta">
            <span className="resume-file-name">{CV_FILENAME}</span>
            <span className="resume-file-sub">Alexey Khromin — Curriculum Vitae</span>
          </div>
        </div>
        <div className="resume-actions">
          <a className="resume-btn primary" href={CV_URL} download={CV_FILENAME}>
            <DownloadIcon sx={{ fontSize: 16 }} />
            Download
          </a>
          <a
            className="resume-btn"
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
            Open in new tab
          </a>
        </div>
      </div>

      {isDesktop ? (
        <div className="resume-preview">
          <object data={CV_URL} type="application/pdf" className="resume-object">
            <div className="resume-fallback">
              <p>Your browser can't display the PDF inline.</p>
              <a className="resume-btn primary" href={CV_URL} download={CV_FILENAME}>
                <DownloadIcon sx={{ fontSize: 16 }} />
                Download the CV
              </a>
            </div>
          </object>
        </div>
      ) : (
        <div className="resume-preview">
          <div className="resume-fallback">
            <p>Preview isn't available on this screen size.</p>
            <a className="resume-btn primary" href={CV_URL} target="_blank" rel="noopener noreferrer">
              <OpenInNewIcon sx={{ fontSize: 16 }} />
              Open the CV
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resume;
