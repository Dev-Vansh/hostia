import apiClient from './client';

export const getAnalytics = async () => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
};

export const getAllOrders = async () => {
    const response = await apiClient.get('/orders/admin/all');
    return response.data.orders;
};

export const verifyPayment = async (orderId, vpsDetails) => {
    // Map property names to match client expectations
    const mappedDetails = {
        vpsDetails: {
            ipAddress: vpsDetails.ip,
            username: vpsDetails.username,
            password: vpsDetails.password,
            panelLink: vpsDetails.panelLink
        },
        renewalDate: vpsDetails.renewalDate
    };
    const response = await apiClient.put(`/orders/${orderId}/verify`, mappedDetails);
    return response.data;
};

export const rejectPayment = async (orderId, rejectionReason) => {
    const response = await apiClient.put(`/orders/${orderId}/reject`, { rejectionReason });
    return response.data;
};

// Manager Page APIs
export const getActiveOrders = async () => {
    const response = await apiClient.get('/orders/manager/active');
    return response.data.orders;
};

export const getExpiredOrders = async () => {
    const response = await apiClient.get('/orders/manager/expired');
    return response.data.orders;
};

export const clearExpiredOrders = async () => {
    const response = await apiClient.delete('/orders/manager/expired');
    return response.data;
};
