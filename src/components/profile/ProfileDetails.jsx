import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const ProfileDetails = () => {
    const { user, login } = useAuth(); // We'll use login to update the local session state
    const [isEditing, setIsEditing] = useState(false);

    // Local state for form fields
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    // Update form data when user changes or editing starts
    // (though user shouldn't change while on this page, good practice)
    React.useEffect(() => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || ''
        });
    }, [user]);

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            alert("Name and Email are required");
            return;
        }

        // Optimistically update or call API then update
        // Since we are using mock authApi that saves to localStorage, we call that first
        // But for simplicity in this context, we can just update the auth context directly to simulate a save
        // A real app would call updateProfile API. Let's do a hybrid.

        const updatedUser = { ...user, ...formData };
        login(updatedUser); // Update context/session

        // Also update our 'database' in authApi so it persists next reload
        const { authApi } = await import('../../services/authApi');
        authApi.updateProfile(user.id, formData);

        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
            </div>

            <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        disabled={true} // Usually phone is unique ID/primary key, hard to change
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                    {isEditing && <p className="text-xs text-gray-400">Phone number cannot be changed.</p>}
                </div>

                {isEditing && (
                    <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave}>Save Changes</Button>
                )}
            </div>
        </div>
    );
};

export default ProfileDetails;
