import api from './api';

export const addressApi = {
    getAddresses: async () => {
        try {
            const response = await api.get('/addresses');
            return response.data;
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw error;
        }
    },

    addAddress: async (addressData) => {
        try {
            const response = await api.post('/addresses', addressData);
            return response.data;
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    },

    updateAddress: async (id, addressData) => {
        try {
            const response = await api.put(`/addresses/${id}`, addressData);
            return response.data;
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    deleteAddress: async (id) => {
        try {
            const response = await api.delete(`/addresses/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    },

    setDefaultAddress: async (id) => {
        try {
            const response = await api.patch(`/addresses/${id}/default`);
            return response.data;
        } catch (error) {
            console.error('Error setting default address:', error);
            throw error;
        }
    },
};
