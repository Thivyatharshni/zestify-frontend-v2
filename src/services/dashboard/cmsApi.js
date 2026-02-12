import api from '../api';

export const cmsApi = {
    // Hero Section
    getHero: () => api.get('/cms/hero'),
    updateHero: (data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        return api.post('/cms/hero', data, config);
    },

    // Categories
    getCategories: () => api.get('/cms/categories'),
    createCategory: (data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        return api.post('/cms/categories', data, config);
    },
    updateCategory: (id, data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        return api.put(`/cms/categories/${id}`, data, config);
    },
    deleteCategory: (id) => api.delete(`/cms/categories/${id}`),

    // Lanes
    getLanes: () => api.get('/cms/lanes'),
    createLane: (data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        return api.post('/cms/lanes', data, config);
    },
    updateLane: (id, data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        return api.put(`/cms/lanes/${id}`, data, config);
    },
    deleteLane: (id) => api.delete(`/cms/lanes/${id}`),

    // Offers
    getOffers: () => api.get('/cms/offers'),
    createOffer: (data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        return api.post('/cms/offers', data, config);
    },
    updateOffer: (id, data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        return api.put(`/cms/offers/${id}`, data, config);
    },
    deleteOffer: (id) => api.delete(`/cms/offers/${id}`),

    // Footer
    getFooter: () => api.get('/cms/footer'),
    updateFooter: (data) => api.post('/cms/footer', data),

    // Media Upload
    uploadMedia: (formData) => api.post('/cms/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
