import api from './api';

export const aptitudeService = {
  getQuestions: async (params = {}) => {
    return api.get('/aptitude/questions', { params });
  },

  submitAttempt: async (attemptData) => {
    return api.post('/aptitude/attempts', attemptData);
  },

  getAttempts: async () => {
    return api.get('/aptitude/attempts');
  },

  deleteAttempt: async (id) => {
    return api.delete(`/aptitude/attempts/${id}`);
  },

  clearAllAttempts: async () => {
    return api.delete('/aptitude/attempts');
  },
};

