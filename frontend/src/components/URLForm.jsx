import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { shortenURL, storeURL } from '../services/api';

const URLForm = ({ onURLShortened }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!longUrl.trim()) {
      setErrors({ longUrl: 'URL is required' });
      return;
    }

    if (!validateURL(longUrl)) {
      setErrors({ longUrl: 'Please enter a valid URL (including http:// or https://)' });
      return;
    }

    if (customAlias && customAlias.length < 3) {
      setErrors({ customAlias: 'Custom alias must be at least 3 characters' });
      return;
    }

    setLoading(true);
    try {
      const result = await shortenURL(longUrl, customAlias);
      
      // Store URL in localStorage for history
      storeURL(result);
      
      onURLShortened(result);
      toast.success('URL shortened successfully!');
      setLongUrl('');
      setCustomAlias('');
    } catch (error) {
      const errorMessage = error.message || 'Failed to shorten URL. Please try again.';
      toast.error(errorMessage);
      if (errorMessage.includes('Alias')) {
        setErrors({ customAlias: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-form-container">
      <form onSubmit={handleSubmit} className="url-form">
        <div className="form-group">
          <label htmlFor="longUrl">Enter your long URL</label>
          <input
            type="url"
            id="longUrl"
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            value={longUrl}
            onChange={(e) => {
              setLongUrl(e.target.value);
              setErrors({});
            }}
            className={errors.longUrl ? 'error' : ''}
            disabled={loading}
          />
          {errors.longUrl && <span className="error-message">{errors.longUrl}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="customAlias">
            Custom alias (optional)
            <span className="optional-badge">Optional</span>
          </label>
          <div className="alias-input-wrapper">
            <span className="alias-prefix">short.url/</span>
            <input
              type="text"
              id="customAlias"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => {
                setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''));
                setErrors({});
              }}
              className={errors.customAlias ? 'error' : ''}
              disabled={loading}
              maxLength={30}
            />
          </div>
          {errors.customAlias && <span className="error-message">{errors.customAlias}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>
    </div>
  );
};

export default URLForm;