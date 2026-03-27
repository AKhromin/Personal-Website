import React from 'react';

function MobileDock({ items }) {
  return (
    <div className="mobile-dock">
      {items.map((item, i) => (
        <button key={i} className="mobile-dock-item" onClick={item.onClick}>
          <item.icon sx={{ fontSize: 26, color: '#fff' }} />
        </button>
      ))}
    </div>
  );
}

export default MobileDock;
