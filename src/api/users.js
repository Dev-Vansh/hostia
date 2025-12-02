import apiClient from './client';

// Get all users (admin only)
export const getAllUsers = async () => {
    const response = await apiClient.get('/users');
    return response.data;
};

// Get user by ID (admin only)
export const getUserById = async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
};

// Create new user (admin only)
export const createUser = async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
};

// Update user details (admin only)
export const updateUser = async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
};

// Update user role (admin only)
export const updateUserRole = async (id, role) => {
    const response = await apiClient.put(`/users/${id}/role`, { role });
    return response.data;
};

// Delete user (admin only)
export const deleteUser = async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
};
