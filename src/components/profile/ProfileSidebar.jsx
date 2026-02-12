import React from 'react';
import { User, MapPin, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/RouteConstants';

import { useLocation } from '../../context/LocationContext';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const { logout } = useAuth();
    const { clearLocation } = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearLocation();
        logout();
        navigate(ROUTES.HOME);
    };

    const menuItems = [
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'profile', label: 'Profile Settings', icon: User },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-fit">
            <nav className="flex flex-col">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === item.id
                            ? 'bg-blue-50 text-blue-700 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 border-transparent'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 border-l-4 border-transparent transition-colors mt-2 border-t border-gray-100"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </nav>
        </div>
    );
};

export default ProfileSidebar;
