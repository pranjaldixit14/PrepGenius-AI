import api from './api';

export const dsaService = {
  getQuestions: async (params = {}) => {
    return api.get('/dsa/questions', { params });
  },

  getQuestionDetail: async (identifier) => {
    return api.get(`/dsa/questions/${identifier}`);
  },

  updateProgress: async (progressData) => {
    return api.post('/dsa/progress', progressData);
  },
};
