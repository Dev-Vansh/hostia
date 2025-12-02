import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '@/api/auth';

const AdminRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = getStoredUser();
    if (user?.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoute;
