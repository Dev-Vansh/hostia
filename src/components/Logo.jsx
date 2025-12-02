import React from 'react';

const Logo = ({ className = '', size = 'md' }) => {
    const sizes = {
        sm: 'text-2xl',
        md: 'text-3xl',
        lg: 'text-4xl'
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform rotate-3">
                    <span className="text-white font-bold text-xl transform -rotate-3">H</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <span className={`font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent ${sizes[size]}`}>
                HOSTIA
            </span>
        </div>
    );
};

export default Logo;
