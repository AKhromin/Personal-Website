import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function MobilePageView({ title, onBack, children }) {
  return (
    <div className="mobile-page-view">
      <div className="mobile-page-header">
        <button className="mobile-back-btn" onClick={onBack}>
          <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          <span>Back</span>
        </button>
        <span className="mobile-page-title">{title}</span>
        <span className="mobile-page-spacer" />
      </div>
      <div className="mobile-page-content">
        {children}
      </div>
    </div>
  );
}

export default MobilePageView;
