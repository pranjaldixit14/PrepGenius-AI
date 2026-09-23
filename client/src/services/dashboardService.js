import api from './api';

export const dashboardService = {
  getDashboardData: async () => {
    return api.get('/dashboard');
  },
};
