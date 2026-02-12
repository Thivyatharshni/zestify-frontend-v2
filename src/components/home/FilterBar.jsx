import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const FILTERS = [
    "Fast Delivery",
    "Rating 4.0+",
    "Pure Veg",
    "Offers",
    "Rs. 300-600",
    "Less than Rs. 300"
];

const FilterBar = ({ activeFilters, onToggle }) => {
    return (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-base font-bold text-gray-900 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm">
                Filter <SlidersHorizontal size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-base font-bold text-gray-900 hover:bg-gray-50 transition-all whitespace-nowrap shadow-sm">
                Sort By <ChevronDown size={14} />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2 hidden md:block"></div>

            {FILTERS.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onToggle(filter)}
                    className={`px-4 py-2 rounded-full border text-base font-bold transition-all whitespace-nowrap ${activeFilters.includes(filter)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                        : 'bg-white text-gray-900 border-gray-200 hover:border-blue-200 hover:text-blue-600'
                        }`}
                >
                    {filter}
                    {activeFilters.includes(filter) && <span className="ml-2 text-xs">✕</span>}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
