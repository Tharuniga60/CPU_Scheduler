import axios from 'axios';

const api = axios.create({
    baseURL: 'https://cpu-scheduler-1gyv.onrender.com/api',
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
