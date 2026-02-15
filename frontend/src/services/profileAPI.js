import api from './api';

// Recruiter Profile APIs
export const recruiterProfileAPI = {
  // Get recruiter profile
  getProfile: async () => {
    try {
      const response = await api.get('/recruiter/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update recruiter profile
  updateProfile: async (formData) => {
    try {
      const response = await api.put('/recruiter/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Company Profile APIs
export const companyProfileAPI = {
  // Get company profile
  getProfile: async () => {
    try {
      const response = await api.get('/recruiter/company-profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create company profile
  createProfile: async (data) => {
    try {
      const response = await api.post('/recruiter/company-profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update company profile
  updateProfile: async (formData) => {
    try {
      const response = await api.put('/recruiter/company-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
