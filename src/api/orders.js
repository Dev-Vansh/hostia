import apiClient from './client';

export const createOrder = async (planId, promoCode, items) => {
    const response = await apiClient.post('/orders', { planId, promoCode, items });
    return response.data;
};

export const getUserOrders = async (userId) => {
    const response = await apiClient.get(`/orders/user/${userId}`);
    return response.data.orders;
};

export const getOrderById = async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.order;
};

export const getOrderQR = async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}/qr`);
    return response.data.qrCode;
};

export const uploadPayment = async (orderId, formData) => {
    const response = await apiClient.post(`/orders/${orderId}/upload-payment`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
};
