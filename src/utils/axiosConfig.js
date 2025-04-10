import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Adding token to request headers:', token.substring(0, 15) + '...');
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
            // Clear token and user data if unauthorized
            console.log('Unauthorized access detected, clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('authChange'));
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
