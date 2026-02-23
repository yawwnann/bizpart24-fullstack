import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (optional, e.g., for auth tokens)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional, for global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let components handle errors themselves
    // Don't log to console here to avoid duplicate error messages
    return Promise.reject(error);
  }
);

export default api;
