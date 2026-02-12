import api from './api';

export const couponApi = {
    getApplicableCoupons: async (restaurantId) => {
        try {
            const response = await api.get('/coupons/applicable', {
                params: restaurantId ? { restaurantId } : {}
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching applicable coupons:', error);
            return [];
        }
    },

    validateCoupon: async (code, cartTotal) => {
        try {
            const response = await api.post('/coupons/validate', {
                code,
                cartTotal
            });
            return response.data; // { valid, discount, message }
        } catch (error) {
            console.error('Error validating coupon:', error);
            throw error;
        }
    }
};
