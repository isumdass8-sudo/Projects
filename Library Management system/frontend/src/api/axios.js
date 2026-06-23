import axios from 'axios';

// All API requests go to our backend server
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Before every request, automatically attach the JWT token if it exists.
// This means we don't have to manually add it in every component.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server returns 401 (token expired/invalid), log the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
