import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail;
    error.userMessage = Array.isArray(detail)
      ? detail.map((d) => d.msg).join(', ')
      : detail || error.message || 'Something went wrong';
    return Promise.reject(error);
  }
);

export default api;
