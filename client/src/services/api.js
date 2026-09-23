import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prepgenius_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear token if expired
        localStorage.removeItem('prepgenius_token');
        localStorage.removeItem('prepgenius_user');
      }
      return Promise.reject(error.response.data || { message: 'Server request failed' });
    }
    return Promise.reject({ message: error.message || 'Network connection failed' });
  }
);

export default api;
