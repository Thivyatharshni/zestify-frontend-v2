import React from 'react';
import { Check } from 'lucide-react';

const OrderTimeline = ({ status }) => {
    const statusOrder = ['PLACED', 'CONFIRMED', 'PREPARING', 'PENDING_ASSIGNMENT', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);

    const steps = [
        { label: "Order Placed", completed: currentIndex >= 0 },
        { label: "Order Confirmed", completed: currentIndex >= 1 },
        { label: "Preparing", completed: currentIndex >= 2 },
        { label: "Pending Assignment", completed: currentIndex >= 3 },
        { label: "Accepted", completed: currentIndex >= 4 },
        { label: "Picked Up", completed: currentIndex >= 5 },
        { label: "Out for Delivery", completed: currentIndex >= 6 },
        { label: "Delivered", completed: currentIndex >= 7 }
    ];

    return (
        <div className="relative pl-8 space-y-8 border-l-2 border-gray-100 ml-4">
            {steps.map((step, idx) => (
                <div key={idx} className="relative">
                    <div className={`absolute -left-[37px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 
            ${step.completed ? 'border-green-600 text-green-600' : 'border-gray-200 text-gray-300'}`}>
                        <Check size={14} strokeWidth={4} />
                    </div>
                    <div className={`text-sm font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderTimeline;
