import apiClient from './client';

export const getPlans = async () => {
    const response = await apiClient.get('/plans');
    return response.data.plans;
};

export const getPlanById = async (planId) => {
    const response = await apiClient.get(`/plans/${planId}`);
    return response.data.plan;
};

export const createPlan = async (planData) => {
    const response = await apiClient.post('/plans', planData);
    return response.data;
};

export const updatePlan = async (planId, planData) => {
    const response = await apiClient.put(`/plans/${planId}`, planData);
    return response.data;
};

export const deletePlan = async (planId) => {
    const response = await apiClient.delete(`/plans/${planId}`);
    return response.data;
};
