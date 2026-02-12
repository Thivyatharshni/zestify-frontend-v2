import api from '../api';

export const restaurantApi = {
    getProfile: () => api.get('/restaurant-admin/profile'),
    updateProfile: (data) => api.patch('/restaurant-admin/profile', data),
    toggleStatus: () => api.patch('/restaurant-admin/toggle'),
    getMenu: (params) => api.get('/restaurant-admin/menu', { params }),
    addMenuItem: (data) => api.post('/restaurant-admin/menu', data),
    updateMenuItem: (id, data) => api.patch(`/restaurant-admin/menu/${id}`, data),
    deleteMenuItem: (id) => api.delete(`/restaurant-admin/menu/${id}`),
    uploadImage: (formData) => api.post('/restaurant-admin/menu/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getOrders: (params) => api.get('/restaurant-admin/orders', { params }),
    getOrderById: (id) => api.get(`/restaurant-admin/orders/${id}`),
    updateOrderStatus: (id, status) => api.patch(`/restaurant-admin/orders/${id}/status`, { orderStatus: status }),
    getStats: () => api.get('/restaurant-admin/stats'),
};
