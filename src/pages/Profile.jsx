import React, { useState } from 'react';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileDetails from '../components/profile/ProfileDetails';
import AddressList from '../components/profile/AddressList';
import Orders from '../pages/Orders'; // Reuse Orders page content
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const { user } = useAuth();

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <Orders embedded={true} />;
            case 'addresses':
                return <AddressList />;
            case 'profile':
                return <ProfileDetails />;
            default:
                return <Orders />;
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-12 md:mt-16">
                <div>Please log in to view profile.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
            <div className="max-w-6xl mx-auto mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-500">{user.email}</p>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 flex-shrink-0">
                    <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div className="flex-1">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
