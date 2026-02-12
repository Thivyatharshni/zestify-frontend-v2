import axios from 'axios';

const getBaseURL = () => {
    // Try to detect the backend URL dynamically
    const currentOrigin = window.location.origin;
    
    // If frontend is running on localhost:3000, backend is likely on localhost:5000
    if (currentOrigin.includes('localhost:3000')) {
        return 'http://localhost:5000/api';
    }
    
    // If frontend is running on a different port, try to guess backend port
    const port = window.location.port;
    if (port === '3000') {
        return 'http://localhost:5000/api';
    } else if (port === '5173') {
        return 'http://localhost:5000/api';
    }
    
    // Default fallback
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access - just clear token and let user stay on public pages
            const token = localStorage.getItem('token');
            if (token) {
                // Only act if we actually had a token (expired session)
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Reload the page to reset state (will render as guest) instead of forcing login
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
