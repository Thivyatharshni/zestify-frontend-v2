import React from 'react';
import { IMAGES } from '../../utils/constants';

const EmptyState = ({ title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-64 h-64 mb-6 opacity-90 rounded-full overflow-hidden shadow-sm bg-blue-50">
                <img src={IMAGES.EMPTY_STATE} alt="Empty" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-8 max-w-sm">{description}</p>
            {action}
        </div>
    );
};

export default EmptyState;
