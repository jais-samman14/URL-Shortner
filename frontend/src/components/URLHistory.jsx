import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getStoredURLs } from '../services/api';
import copy from 'clipboard-copy';

const URLHistory = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchURLs();
  }, []);

  const fetchURLs = () => {
    try {
      setLoading(true);
      const storedUrls = getStoredURLs();
      setUrls(storedUrls);
    } catch (err) {
      toast.error('Failed to load URL history');
    } finally {
      setLoading(false);
    }
  };

  // Refresh history when new URL is added
  useEffect(() => {
    const handleStorageChange = () => {
      fetchURLs();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCopy = async (url) => {
    try {
      await copy(url);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const formatUrl = (url) => {
    if (!url) return '';
    return url.length > 50 ? url.substring(0, 47) + '...' : url;
  };

  if (loading) {
    return (
      <div className="url-history">
        <h3>Recent URLs</h3>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading history...</p>
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return null;
  }

  return (
    <div className="url-history">
      <h3>Recent URLs</h3>
      <div className="history-list">
        {urls.map((url, index) => (
          <div key={url.id || index} className="history-item">
            <div className="history-item-content">
              <div className="history-urls">
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-url"
                >
                  {url.shortUrl}
                </a>
                <span className="arrow">→</span>
                <span className="long-url" title={url.longUrl}>
                  {formatUrl(url.longUrl)}
                </span>
              </div>
              <div className="history-meta">
                {url.clicks !== undefined && (
                  <span className="clicks">👁 {url.clicks} clicks</span>
                )}
                {url.createdAt && (
                  <span className="date">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleCopy(url.shortUrl)}
              className="copy-history-btn"
              title="Copy short URL"
            >
              📋
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default URLHistory;