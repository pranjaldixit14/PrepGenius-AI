import api from './api';

export const companyService = {
  getCompanies: async () => {
    return api.get('/companies');
  },

  getCompanyDetails: async (identifier) => {
    return api.get(`/companies/${identifier}`);
  },
};
