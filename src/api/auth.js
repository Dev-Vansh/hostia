import apiClient from './client';

export const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
};

export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const adminLogin = async (email, password) => {
    const response = await apiClient.post('/auth/admin/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

export const getStoredUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
    const user = getStoredUser();
    return user?.role || null;
};
