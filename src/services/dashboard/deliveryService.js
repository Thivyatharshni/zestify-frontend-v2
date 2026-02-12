import api from '../api';

export const deliveryService = {
    getProfile: () => api.get('/delivery-partner/profile'),
    updateProfile: (data) => api.patch('/delivery-partner/profile', data),
    toggleOnline: () => api.patch('/delivery-partner/toggle-online'),
    getOrders: (params) => api.get('/delivery-partner/orders', { params }),
    acceptOrder: (id) => api.patch(`/delivery-partner/orders/${id}/accept`),
    rejectOrder: (id) => api.patch(`/delivery-partner/orders/${id}/reject`),
    updateOrderStatus: (id, status) => api.patch(`/delivery-partner/orders/${id}/status`, { status }),
    getEarnings: () => api.get('/delivery-partner/earnings'),
    getHistory: (params) => api.get('/delivery-partner/history', { params }),
    updateLocation: (lat, lng) => api.patch('/delivery-partner/location', { lat, lng }),
};
