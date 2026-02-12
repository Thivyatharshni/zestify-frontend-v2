import api from './api';

export const orderApi = {
    placeOrder: async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Order placement failed:', error);
            throw error;
        }
    },

    getOrders: async () => {
        try {
            const response = await api.get('/orders');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        }
    },

    getOrderById: async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch order:', error);
            throw error;
        }
    },

    cancelOrder: async (orderId) => {
        try {
            const response = await api.patch(`/orders/${orderId}/cancel`);
            return response.data;
        } catch (error) {
            console.error('Failed to cancel order:', error);
            throw error;
        }
    }
};
