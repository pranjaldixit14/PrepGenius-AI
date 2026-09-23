import api from './api';

export const interviewService = {
  createSession: async (config) => {
    return api.post('/interview/session', config);
  },

  submitAnswer: async (sessionId, answer) => {
    return api.post('/interview/answer', { sessionId, answer });
  },

  getSession: async (id) => {
    return api.get(`/interview/session/${id}`);
  },

  getSessions: async () => {
    return api.get('/interview/sessions');
  },
};
