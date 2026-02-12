import api from './api';

export const cartApi = {
    getCart: async () => {
        try {
            const response = await api.get('/cart');
            return response.data;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    },

    addToCart: async (restaurantId, menuItemId, quantity, addons = []) => {
        try {
            // Defensive normalization - ensure we're sending strings, not objects
            const normalizedRestaurantId = restaurantId?.$oid || restaurantId?._id || restaurantId?.toString() || restaurantId;
            const normalizedMenuItemId = menuItemId?.$oid || menuItemId?._id || menuItemId?.toString() || menuItemId;

            console.log('CartAPI - Adding to cart:', {
                originalRestaurantId: restaurantId,
                normalizedRestaurantId,
                originalMenuItemId: menuItemId,
                normalizedMenuItemId,
                quantity,
                addons
            });

            // Final validation - ensure we have valid strings
            if (!normalizedRestaurantId || typeof normalizedRestaurantId !== 'string' || normalizedRestaurantId === '[object Object]') {
                throw new Error(`Invalid restaurantId: ${normalizedRestaurantId}`);
            }
            if (!normalizedMenuItemId || typeof normalizedMenuItemId !== 'string' || normalizedMenuItemId === '[object Object]') {
                throw new Error(`Invalid menuItemId: ${normalizedMenuItemId}`);
            }

            const response = await api.post('/cart/add', {
                restaurantId: normalizedRestaurantId,
                menuItemId: normalizedMenuItemId,
                quantity,
                addons
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error adding item to cart:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Full error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            throw error;
        }
    },

    updateCartItem: async (menuItemId, quantity) => {
        try {
            const response = await api.patch('/cart/update', {
                menuItemId,
                quantity
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    removeFromCart: async (menuItemId) => {
        try {
            const response = await api.delete(`/cart/remove/${menuItemId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            const response = await api.delete('/cart/clear');
            return response.data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
};
