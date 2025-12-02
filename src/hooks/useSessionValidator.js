import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/api/auth';
import { logout } from '@/api/auth';

// Custom hook to validate session periodically and logout if session is invalid
export const useSessionValidator = (checkInterval = 60000) => {
    useEffect(() => {
        const validateSession = async () => {
            try {
                await getCurrentUser();
            } catch (error) {
                if (error.response?.status === 401) {
                    // Session is invalid (password was changed, token expired, etc.)
                    logout();
                    window.location.href = '/login';
                }
            }
        };

        // Initial validation
        validateSession();

        // Check periodically
        const interval = setInterval(validateSession, checkInterval);

        return () => clearInterval(interval);
    }, [checkInterval]);
};
