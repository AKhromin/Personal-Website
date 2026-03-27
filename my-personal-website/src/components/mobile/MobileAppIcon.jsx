import React from 'react';

function MobileAppIcon({ icon: Icon, label, color, onClick }) {
  return (
    <button className="mobile-app-icon" onClick={onClick}>
      <div className="mobile-app-icon-bg" style={{ background: color || '#333' }}>
        {Icon && <Icon sx={{ fontSize: 28, color: '#fff' }} />}
      </div>
      <span className="mobile-app-icon-label">{label}</span>
    </button>
  );
}

export default MobileAppIcon;
