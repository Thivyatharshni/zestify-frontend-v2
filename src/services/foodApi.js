import api from './api';

export const foodApi = {
    /**
     * Get all restaurants for food discovery
     */
    getRestaurants: async () => {
        try {
            const response = await api.get('/food/restaurants');
            return response.data?.data || [];
        } catch (error) {
            console.error('Error fetching food restaurants:', error);
            return [];
        }
    },

    /**
     * Get all food categories
     */
    getCategories: async () => {
        try {
            const response = await api.get('/food/categories');
            return response.data?.data || [];
        } catch (error) {
            console.error('Error fetching food categories:', error);
            return [];
        }
    },

    /**
     * Get food items with optional filters
     * @param {Object} filters - { category, restaurant, limit }
     */
    getFoodItems: async (filters = {}) => {
        try {
            const response = await api.get('/food/items', { params: filters });
            return response.data?.data || [];
        } catch (error) {
            console.error('Error fetching food items:', error);
            return [];
        }
    },

    /**
     * Get single food item by ID
     * @param {string} id - Food item ID
     */
    getFoodItemById: async (id) => {
        try {
            const response = await api.get(`/food/items/${id}`);
            return response.data?.data || null;
        } catch (error) {
            console.error(`Error fetching food item ${id}:`, error);
            return null;
        }
    }
};
