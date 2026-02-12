import api from './api';

export const authApi = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            return response.data; // { user, token }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.message
                || 'Login failed';
            throw errorMessage;
        }
    },

    signup: async (name, email, password, phone) => {
        try {
            const response = await api.post('/auth/signup', {
                name,
                email,
                password,
                phone: phone || '0000000000'
            });
            return response.data; // { user, token }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.message
                || 'Signup failed';
            throw errorMessage;
        }
    },

    getProfile: async () => {
        try {
            const response = await api.get('/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to fetch profile';
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update profile';
        }
    }
};

export default authApi;
