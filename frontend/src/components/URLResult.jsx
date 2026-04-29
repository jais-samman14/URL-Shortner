import React, { useState } from 'react';
import copy from 'clipboard-copy';
import { toast } from 'react-toastify';

const URLResult = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copy(result.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shortened URL',
          text: 'Check out this shortened URL!',
          url: result.shortUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="url-result animate-slide-in">
      <div className="result-header">
        <h3>🎉 URL Shortened Successfully!</h3>
        <button onClick={onClose} className="close-btn" aria-label="Close">
          ×
        </button>
      </div>

      <div className="result-content">
        <div className="url-info">
          <div className="url-box">
            <label>Short URL</label>
            <div className="url-display">
              <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                {result.shortUrl}
              </a>
            </div>
          </div>

          <div className="url-box original-url">
            <label>Original URL</label>
            <div className="url-display">
              <span className="original-url-text">{result.longUrl}</span>
            </div>
          </div>

          {result.createdAt && (
            <div className="url-meta">
              <span>Created: {new Date(result.createdAt).toLocaleString()}</span>
              {result.clicks !== undefined && <span>Clicks: {result.clicks}</span>}
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button onClick={handleCopy} className={`action-btn copy-btn ${copied ? 'copied' : ''}`}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button onClick={handleShare} className="action-btn share-btn">
            📤 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default URLResult;