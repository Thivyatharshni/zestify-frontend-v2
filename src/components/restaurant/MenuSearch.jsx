import React from 'react';
import { Search } from 'lucide-react';

const MenuSearch = ({ value, onChange }) => {
    return (
        <div className="py-6 px-2">
            <div className="relative group max-w-2xl mx-auto md:mx-0">
                <input
                    type="text"
                    placeholder="Search within menu (e.g. Burgers, Pizza...)"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/50 backdrop-blur-md text-gray-900 rounded-[2rem] text-sm border-2 border-slate-200/60 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 font-medium shadow-sm group-hover:shadow-md"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={20} strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
};

export default MenuSearch;
