import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// প্রতিটা request এ automatically token attach করবে
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Jobs endpoints
export const getAllJobs = (params) => API.get('/jobs', { params });
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const postJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.patch(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Applications endpoints
export const applyForJob = (data) => API.post('/applications', data);
export const myApplications = () => API.get('/applications/mine');
export const jobApplicants = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateAppStatus = (id, data) => API.patch(`/applications/${id}`, data);

// Admin endpoints
export const getAllUsers = () => API.get('/admin/users');
export const verifyEmployer = (id) => API.patch(`/admin/employers/${id}/verify`);

// CV Upload
export const uploadCV = (formData) => API.post('/users/upload-cv', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;