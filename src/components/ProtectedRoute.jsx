import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '@/api/auth';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = getStoredUser();
    if (user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
