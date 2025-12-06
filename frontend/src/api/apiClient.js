import axios from 'axios';

/**
 * API Client Configuration
 */

const API_BASE_URL = "https://remotion-captioning-platform.onrender.com"

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.error?.message || error.message || 'An error occurred';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
