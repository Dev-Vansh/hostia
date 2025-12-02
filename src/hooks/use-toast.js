import { useState, useEffect } from 'react';

export const useToast = () => {
    const toast = ({ title, description, variant = 'default' }) => {
        const event = new CustomEvent('show-toast', {
            detail: { title, description, variant, id: Date.now() }
        });
        window.dispatchEvent(event);
    };

    return { toast };
};
