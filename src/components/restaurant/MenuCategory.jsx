import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FoodItemCard from './FoodItemCard';

const MenuCategory = ({ category, restaurantId, defaultOpen = true, anchorId, highlight = false, highlightItemId }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div id={anchorId} className={`border-b-[10px] border-gray-100 last:border-0 scroll-mt-28 ${highlight ? 'bg-blue-50/40' : ''}`}>
            <div
                className="flex justify-between items-center py-6 cursor-pointer px-4 sm:px-0"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className={`font-extrabold text-lg ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>
                    {category.categoryName} ({category.items.length})
                </h2>
                {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </div>

            {isOpen && (
                <div className="px-4 sm:px-0 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {category.items.map((item) => {
                        const itemId = item.id; // Already normalized by Restaurant.jsx
                        return (
                            <FoodItemCard
                                key={itemId}
                                item={item}
                                restaurantId={restaurantId}
                                anchorId={itemId ? `menu-item-${itemId}` : undefined}
                                highlight={highlightItemId && String(itemId) === String(highlightItemId)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MenuCategory;
