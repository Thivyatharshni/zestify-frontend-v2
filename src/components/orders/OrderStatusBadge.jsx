import React from 'react';
import { clsx } from 'clsx';

const OrderStatusBadge = ({ status }) => {
    const styles = {
        PLACED: 'bg-blue-100 text-blue-600',
        CONFIRMED: 'bg-yellow-100 text-yellow-600',
        PREPARING: 'bg-blue-100 text-blue-600',
        PENDING_ASSIGNMENT: 'bg-orange-100 text-orange-600',
        ACCEPTED: 'bg-indigo-100 text-indigo-600',
        PICKED_UP: 'bg-purple-100 text-purple-600',
        OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-600',
        DELIVERED: 'bg-green-100 text-green-600',
        CANCELLED: 'bg-red-100 text-red-600',
    };

    return (
        <span className={clsx("px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider", styles[status] || styles.DELIVERED)}>
            {status}
        </span>
    );
};

export default OrderStatusBadge;
