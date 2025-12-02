import React from 'react';

const statusColors = {
    pending_upload: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    payment_uploaded: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    payment_verified: 'bg-green-500/20 text-green-300 border-green-500/30',
    active: 'bg-green-500/20 text-green-300 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
};

const statusLabels = {
    pending_upload: 'Pending Upload',
    payment_uploaded: 'Payment Uploaded',
    payment_verified: 'Verified',
    active: 'Active',
    rejected: 'Rejected',
    cancelled: 'Cancelled'
};

const OrderStatusBadge = ({ status }) => {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status] || statusColors.pending_upload}`}>
            {statusLabels[status] || status}
        </span>
    );
};

export default OrderStatusBadge;
