import api from '../api';

export const adminService = {
    getUsers: () => api.get('/admin/users'),
    blockUser: (id) => api.patch(`/admin/users/${id}/block`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getRestaurants: () => api.get('/admin/restaurants'),
    createRestaurant: (data) => api.post('/admin/restaurants', data),
    toggleRestaurantStatus: (id) => api.patch(`/admin/restaurants/${id}/toggle`),
    deleteRestaurant: (id) => api.delete(`/admin/restaurants/${id}`),
    getDeliveryPartners: () => api.get('/admin/delivery'),
    createDeliveryPartner: (data) => api.post('/admin/delivery', data),
    deleteDeliveryPartner: (id) => api.delete(`/admin/delivery/${id}`),
    getOrders: () => api.get('/admin/orders'),
    getStats: () => api.get('/admin/stats'),
    getNotifications: () => api.get('/admin/notifications'),
    updateProfile: (data) => api.patch('/admin/profile', data),
};
