import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://url-shortner-backend-hj3e.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Server is waking up, please try again in 10 seconds! ☕';
    } else if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
    }
    return Promise.reject(error);
  }
);

export const shortenURL = async (longUrl, customAlias = '') => {
  try {
    const payload = {
      original_url: longUrl,  // Match your backend field name
    };
    
    if (customAlias) {
      payload.custom_alias = customAlias;  // Match your backend field name
    }
    
    const response = await api.post('/shorten', payload);
    
    // Transform response to match frontend expectations
    const data = response.data;
    return {
      shortUrl: data.short_url,
      shortCode: data.short_code,
      longUrl: data.original_url,
      createdAt: new Date().toISOString(),
      clicks: 0
    };
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const getURLStats = async (shortCode) => {
  try {
    const response = await api.get(`/stats/${shortCode}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Since your backend doesn't have a GET /urls endpoint,
// we'll use localStorage to maintain history on frontend
export const getStoredURLs = () => {
  try {
    const urls = localStorage.getItem('shortenedUrls');
    return urls ? JSON.parse(urls) : [];
  } catch {
    return [];
  }
};

export const storeURL = (urlData) => {
  try {
    const urls = getStoredURLs();
    urls.unshift({
      ...urlData,
      id: Date.now()
    });
    // Keep only last 20 URLs
    const trimmedUrls = urls.slice(0, 20);
    localStorage.setItem('shortenedUrls', JSON.stringify(trimmedUrls));
  } catch (error) {
    console.error('Failed to store URL:', error);
  }
};

export default api;