import React, { useState, useEffect } from 'react';
import {
    User,
    Phone,
    Bike,
    Save,
    Shield
} from 'lucide-react';
import {
    Card,
    Button,
    Input,
    Loader
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const DeliveryProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        vehicleNumber: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await deliveryService.getProfile();
            if (response.data.success) {
                const data = response.data.data;
                setProfile(data);
                setFormData({
                    name: data.name,
                    phone: data.phone,
                    vehicleNumber: data.vehicleNumber || ''
                });
            } else {
                toast.error('Profile data not available');
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            // Provide more specific error messages
            if (error.response?.status === 401) {
                toast.error('Please log in as a delivery partner');
            } else if (error.response?.status === 403) {
                toast.error('Access denied. You must be a delivery partner');
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please try again later');
            } else {
                toast.error('Failed to load profile. Check your connection');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await deliveryService.updateProfile(formData);
            if (response.data.success) {
                toast.success('Profile updated successfully');
                setProfile(response.data.data);
            }
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Rider Profile</h1>
                <p className="text-white/50 font-medium italic mt-1">Manage your personal information and vehicle details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card dark className="lg:col-span-1 h-fit">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
                                <User size={48} />
                            </div>
                            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-[#070b14] ${profile?.isOnline ? 'bg-emerald-500' : 'bg-slate-600'} shadow-lg`} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">{profile?.name}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mt-1 italic">Verified Rider</p>
                        </div>
                        <div className="w-full space-y-4 pt-4">
                            <div className="flex items-center gap-3 text-white/70 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <Phone size={18} className="text-blue-400" />
                                <span className="text-sm font-bold">+{profile?.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/70 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <Bike size={18} className="text-blue-400" />
                                <span className="text-sm font-bold">{profile?.vehicleNumber || 'Not Set'}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Edit Form */}
                <Card dark className="lg:col-span-2">
                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5"><User size={24} /></div>
                                <h3 className="text-xl font-black text-white tracking-tight">Personal Details</h3>
                            </div>
                            <Button dark type="submit" disabled={saving} className="gap-2 px-8 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-blue-600 border-0 hover:bg-blue-500">
                                {saving ? 'Saving...' : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                dark
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                            <Input
                                dark
                                label="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="9876543210"
                            />
                        </div>

                        <div className="space-y-8 pt-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5"><Bike size={24} /></div>
                                <h3 className="text-xl font-black text-white tracking-tight">Vehicle Information</h3>
                            </div>
                            <Input
                                dark
                                label="Vehicle Registration Number"
                                value={formData.vehicleNumber}
                                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                placeholder="KA-01-AB-1234"
                            />
                        </div>
                    </form>
                </Card>
            </div>

            <div className="mt-8 p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-between shadow-2xl overflow-hidden relative group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                <div className="flex items-center gap-6 z-10">
                    <div className="p-5 bg-blue-500 rounded-3xl shadow-xl shadow-blue-500/20 text-white"><Shield size={32} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">Account Security</h2>
                        <p className="text-white/40 font-medium italic">Manage your password and login preferences</p>
                    </div>
                </div>
                <Button dark variant="outline" className="text-white border-white/10 hover:bg-white/10 h-14 px-8 z-10 transition-all font-black uppercase tracking-widest text-[10px]">
                    Change Password
                </Button>
            </div>
        </div>
    );
};

export default DeliveryProfile;
