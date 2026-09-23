import api from './api';

export const authService = {
  signup: async (userData) => {
    return api.post('/auth/signup', userData);
  },

  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  getProfile: async () => {
    return api.get('/profile');
  },

  updateProfile: async (updates) => {
    return api.put('/profile', updates);
  },
};
