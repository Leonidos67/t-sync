import React from "react";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="foot-brand">T‑Sync</div>
        <div className="foot-copy">© {year} T‑Sync</div>
      </div>
    </footer>
  );
};

export default Footer;


