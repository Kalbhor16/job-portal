import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Request interceptor - token from localStorage:', !!token);
  console.log('Request URL:', config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers.Authorization.substring(0, 20) + '...');
  } else {
    console.warn('No token found in localStorage for URL:', config.url);
  }
  // Don't force JSON content-type for FormData (let axios handle it)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
    console.log('FormData request detected, Content-Type deleted');
  }
  return config;
});

// Job Seeker Profile Services
export const profileService = {
  getMyProfile: () => api.get('/profile'),
  getProfileById: (userId) => api.get(`/profile/${userId}`),
  updateProfile: (data) => api.put('/profile', data),
  uploadProfilePhoto: (formData) => api.post('/profile/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadResume: (formData) => api.post('/profile/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Education
  addEducation: (data) => api.post('/profile/education', data),
  updateEducation: (eduId, data) => api.put(`/profile/education/${eduId}`, data),
  deleteEducation: (eduId) => api.delete(`/profile/education/${eduId}`),
  
  // Work Experience
  addWorkExperience: (data) => api.post('/profile/work-experience', data),
  updateWorkExperience: (expId, data) => api.put(`/profile/work-experience/${expId}`, data),
  deleteWorkExperience: (expId) => api.delete(`/profile/work-experience/${expId}`),
  
  // Skills
  addSkill: (skillName) => api.post('/profile/skills', { skill: skillName }),
  deleteSkill: (skillName) => api.delete(`/profile/skills/${skillName}`),
};

// Job Services
export const jobService = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (jobId) => api.get(`/jobs/${jobId}`),
  searchJobs: (keyword) => api.get('/jobs', { params: { keyword } }),
  filterJobs: (filters) => api.get('/jobs', { params: filters }),
};

// Application Services
export const applicationService = {
  applyJob: (jobId, data) => api.post(`/applications/${jobId}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyApplications: () => api.get('/applications/my'),
  getApplicationDetails: (appId) => api.get(`/applications/${appId}`),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  updateApplicationStatus: (appId, status) => api.put(`/applications/${appId}/status`, { status }),
};

// Interview Services
export const interviewService = {
  scheduleInterview: (data) => api.post('/interviews', data),
  getMyInterviews: () => api.get('/interviews/my/interviews'),
  getJobInterviews: (jobId) => api.get(`/interviews/job/${jobId}`),
  getInterviewDetails: (interviewId) => api.get(`/interviews/${interviewId}`),
  updateInterview: (interviewId, data) => api.put(`/interviews/${interviewId}`, data),
  confirmInterview: (interviewId) => api.put(`/interviews/${interviewId}/confirm`),
  requestReschedule: (interviewId, data) => api.put(`/interviews/${interviewId}/reschedule`, data),
  cancelInterview: (interviewId, data) => api.put(`/interviews/${interviewId}/cancel`, data),
  completeInterview: (interviewId, data) => api.put(`/interviews/${interviewId}/complete`, data),
  deleteInterview: (interviewId) => api.delete(`/interviews/${interviewId}`),
};

// Saved Jobs Services
export const savedJobService = {
  saveJob: (jobId, notes = '') => api.post(`/saved-jobs/${jobId}`, { notes }),
  unsaveJob: (jobId) => api.delete(`/saved-jobs/${jobId}`),
  // Return the array of saved job documents (populated `job` field)
  getSavedJobs: (params) => api.get('/saved-jobs', { params }).then(res => res.data.savedJobs || []),
  // Route uses /saved-jobs/check/:jobId on server
  checkIfSaved: (jobId) => api.get(`/saved-jobs/check/${jobId}`),
};

// Message Services
export const messageService = {
  sendMessage: (data) => api.post('/messages', data),
  getMessages: (jobId) => api.get(`/messages/job/${jobId}`),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  getMyConversations: () => api.get('/messages/conversations'),
};

// Notification Services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getMe: () => api.get('/auth/me'),
};

export default api;
