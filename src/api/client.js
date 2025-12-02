import axios from 'axios';

// Force correct port - updated at 01:05
const API_BASE_URL = '/api';



// Create axios instance
const apiClient = axios.create({
    baseURL: '/api', // Use relative path for proxy
    headers: {
        'Content-Type': 'application/json'
    }
});


// Add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ignore 401s from login endpoints (since we try admin login then user login)
        if (error.config.url.includes('/login')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            console.warn('401 Unauthorized detected. Redirecting to login.', error.config.url);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
export { API_BASE_URL };
