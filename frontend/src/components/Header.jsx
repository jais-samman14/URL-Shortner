// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h1>ShortURL Pro</h1>
        </div>
        <p className="tagline">
          Enterprise-Grade URL Shortening • Lightning Fast • Secure
        </p>
      </div>
    </header>
  );
};

export default Header;