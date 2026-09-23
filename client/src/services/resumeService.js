import api from './api';

export const resumeService = {
  uploadResume: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('resume', file);

    return api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  getHistory: async () => {
    return api.get('/resume/history');
  },

  getResumeById: async (id) => {
    return api.get(`/resume/${id}`);
  },
};
