import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} ShortURL. All rights reserved.</p>
        <div className="footer-links">
          <span>Fast</span>
          <span className="separator">•</span>
          <span>Secure</span>
          <span className="separator">•</span>
          <span>Free</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;