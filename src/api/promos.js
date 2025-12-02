import apiClient from './client';

export const validatePromo = async (code, planId, price) => {
    const response = await apiClient.post('/promos/validate', { code, planId, price });
    return response.data;
};

export const getPromos = async () => {
    const response = await apiClient.get('/promos');
    return response.data.promos;
};

export const createPromo = async (promoData) => {
    const response = await apiClient.post('/promos', promoData);
    return response.data;
};

export const updatePromo = async (promoId, promoData) => {
    const response = await apiClient.put(`/promos/${promoId}`, promoData);
    return response.data;
};

export const deletePromo = async (promoId) => {
    const response = await apiClient.delete(`/promos/${promoId}`);
    return response.data;
};
