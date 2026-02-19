import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://zestify-backend-h49l.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
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
