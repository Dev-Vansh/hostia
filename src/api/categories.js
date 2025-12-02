import apiClient from './client';

export const getCategories = async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get('/categories', { params });
    return response.data.categories;
};

export const getAllCategories = async () => {
    const response = await apiClient.get('/categories/admin/all');
    return response.data.categories;
};

export const createCategory = async (categoryData) => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
    const response = await apiClient.put(`/categories/${categoryId}`, categoryData);
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
};
