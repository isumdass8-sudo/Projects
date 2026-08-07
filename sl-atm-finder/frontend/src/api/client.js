import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL: API_BASE_URL });

// Attach the JWT token (if present) to every outgoing request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sl_atm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;

// --- API helper functions, grouped by resource ---

export const banksApi = {
  getAll: () => client.get('/banks').then((r) => r.data),
  search: (q) => client.get('/banks/search', { params: { q } }).then((r) => r.data),
};

export const atmsApi = {
  getAll: (limit) => client.get('/atms', { params: { limit } }).then((r) => r.data),
  getById: (id) => client.get(`/atms/${id}`).then((r) => r.data),
  search: (filters) => client.get('/atms/search', { params: filters }).then((r) => r.data),
  nearest: (lat, lng, opts = {}) =>
    client.get('/atms/nearest', { params: { lat, lng, ...opts } }).then((r) => r.data),
  emergency: (lat, lng) =>
    client.get('/atms/emergency', { params: { lat, lng } }).then((r) => r.data),
  route: (params) => client.get('/atms/route', { params }).then((r) => r.data),
  getFeedback: (atmId) => client.get(`/atms/${atmId}/feedback`).then((r) => r.data),
  submitFeedback: (atmId, payload) =>
    client.post(`/atms/${atmId}/feedback`, payload).then((r) => r.data),
  reportProblem: (atmId, problem) =>
    client.post(`/atms/${atmId}/report`, { problem }).then((r) => r.data),
};

export const userApi = {
  getFavorites: () => client.get('/user/favorites').then((r) => r.data),
  addFavorite: (atmId) => client.post(`/user/favorites/${atmId}`).then((r) => r.data),
  removeFavorite: (atmId) => client.delete(`/user/favorites/${atmId}`).then((r) => r.data),
  getRecentlyViewed: () => client.get('/user/recently-viewed').then((r) => r.data),
};

export const districtsApi = {
  getAll: () => client.get('/districts').then((r) => r.data),
};
