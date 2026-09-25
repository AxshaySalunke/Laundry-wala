import React from 'react';

export function Header() {
  return (
    <header className="site-header" aria-label="Lundry Wala header">
      <div className="brand-mark">LW</div>
      <div className="brand-copy">
        <div className="brand-hindi">लुंड्री वाला</div>
        <div className="brand-sub">90s RADIO&nbsp;&nbsp;·&nbsp;&nbsp;मोहल्ले से</div>
      </div>
      <div className="live-status">
        <i /> LIVE · 90s HINDI
      </div>
    </header>
  );
}
