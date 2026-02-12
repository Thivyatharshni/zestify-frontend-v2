import React, { useState, useEffect } from 'react';
import {
    Settings,
    Store,
    MapPin,
    Clock,
    UtensilsCrossed,
    Save,
    Power,
    Image as ImageIcon,
    Camera
} from 'lucide-react';
import {
    Card,
    Button,
    Input,
    Loader,
    Badge
} from '../../components/ui/DashboardUI';
import { restaurantApi } from '../../services/dashboard/restaurantService';
import toast from 'react-hot-toast';

const RestaurantProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cuisines: '',
        deliveryTime: '',
        avgPriceForTwo: '',
        isPureVeg: false,
        image: '',
        heroImageUrl: '',
        location: {
            address: '',
            lat: 0,
            lng: 0
        }
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await restaurantApi.getProfile();
            if (response.data.success) {
                const data = response.data.data;
                setProfile(data);
                setFormData({
                    name: data.name,
                    cuisines: data.cuisines.join(', '),
                    deliveryTime: data.deliveryTime,
                    avgPriceForTwo: data.avgPriceForTwo,
                    isPureVeg: data.isPureVeg,
                    image: data.image,
                    heroImageUrl: data.heroImageUrl || '',
                    location: data.location
                });
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const cuisinesArray = formData.cuisines.split(',').map(c => c.trim()).filter(c => c !== '');
            const response = await restaurantApi.updateProfile({
                ...formData,
                cuisines: cuisinesArray
            });
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

    const toggleOpenStatus = async () => {
        try {
            const response = await restaurantApi.toggleStatus();
            if (response.data.success) {
                setProfile({ ...profile, isOpen: response.data.data.isOpen });
                toast.success(`Restaurant is now ${response.data.data.isOpen ? 'OPEN' : 'CLOSED'}`);
            }
        } catch (error) {
            toast.error('Failed to toggle status');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const dummyFormData = new FormData();
        dummyFormData.append('image', file);

        try {
            toast.loading('Uploading logo...', { id: 'logo-upload' });
            const response = await restaurantApi.uploadImage(dummyFormData);
            if (response.data.success) {
                setFormData({ ...formData, image: response.data.imageUrl });
                toast.success('Logo updated', { id: 'logo-upload' });
            }
        } catch (error) {
            toast.error('Logo upload failed', { id: 'logo-upload' });
        }
    };

    const handleHeroImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const dummyFormData = new FormData();
        dummyFormData.append('image', file);

        try {
            toast.loading('Uploading hero image...', { id: 'hero-upload' });
            const response = await restaurantApi.uploadImage(dummyFormData);
            if (response.data.success) {
                setFormData({ ...formData, heroImageUrl: response.data.imageUrl });
                toast.success('Hero image updated', { id: 'hero-upload' });
            }
        } catch (error) {
            toast.error('Hero image upload failed', { id: 'hero-upload' });
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Shop Settings</h1>
                    <p className="text-white/50 font-medium italic mt-1">Configure your public restaurant identity</p>
                </div>
                <div
                    onClick={toggleOpenStatus}
                    className={`group flex items-center gap-4 px-6 py-4 rounded-3xl cursor-pointer transition-all border-2 ${profile?.isOpen
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20'
                        : 'bg-white/5 text-white/30 border-white/10 backdrop-blur-md'
                        }`}
                >
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Status</span>
                        <span className="text-lg font-black tracking-tighter underline decoration-white/30 decoration-4">
                            {profile?.isOpen ? 'NOW OPEN' : 'CLOSED NOW'}
                        </span>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all ${profile?.isOpen ? 'bg-white text-emerald-500 rotate-12' : 'bg-white/10 text-white/20'}`}>
                        <Power size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card dark className="lg:col-span-1 h-fit">
                    <div className="relative group overflow-hidden rounded-3xl mb-8 border border-white/10 shadow-2xl">
                        <img
                            src={formData.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000'}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            alt="Restaurant"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                        <div className="absolute top-4 left-4">
                            <Badge dark variant={profile?.isOpen ? 'success' : 'neutral'}>{profile?.isOpen ? 'Online' : 'Offline'}</Badge>
                        </div>
                        <label className="absolute bottom-6 right-6 cursor-pointer">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl text-blue-400 border border-white/20 hover:scale-110 active:scale-95 transition-all">
                                <Camera size={24} />
                            </div>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-black tracking-tighter">{profile?.name}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mt-1 italic">Brand Logo</p>
                        </div>
                    </div>

                    <div className="space-y-6 px-2">
                        <div className="flex items-center gap-4 text-white/50 group">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors"><MapPin size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Location</p>
                                <p className="text-sm font-bold truncate max-w-[180px] italic text-white">{profile?.location?.address || 'Set your address'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/50 group">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors"><Clock size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Prep Time</p>
                                <p className="text-sm font-bold italic text-white">{profile?.deliveryTime} Minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white/50 group">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors"><UtensilsCrossed size={18} /></div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Specialty</p>
                                <p className="text-sm font-bold truncate max-w-[180px] italic text-white">{profile?.cuisines?.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Edit Form */}
                <Card dark className="lg:col-span-2">
                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5"><Store size={24} /></div>
                                <h3 className="text-xl font-black text-white tracking-tight">Identity & Branding</h3>
                            </div>
                            <Button dark type="submit" disabled={saving} className="gap-2 px-8">
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
                                label="Restaurant Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Delicious Diner"
                            />
                            <Input
                                dark
                                label="Cuisines (Comma separated)"
                                value={formData.cuisines}
                                onChange={(e) => setFormData({ ...formData, cuisines: e.target.value })}
                                placeholder="Indian, Chinese, Continental"
                            />
                            <Input
                                dark
                                label="Delivery Time (Mins)"
                                type="number"
                                value={formData.deliveryTime}
                                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                placeholder="25"
                            />
                            <Input
                                dark
                                label="Avg Price for Two (₹)"
                                type="number"
                                value={formData.avgPriceForTwo}
                                onChange={(e) => setFormData({ ...formData, avgPriceForTwo: e.target.value })}
                                placeholder="400"
                            />
                        </div>

                        <div className="space-y-8 pt-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/20"><MapPin size={24} /></div>
                                <h3 className="text-xl font-black text-white tracking-tight">Store Location</h3>
                            </div>
                            <Input
                                dark
                                label="Full Commercial Address"
                                value={formData.location.address}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    location: { ...formData.location, address: e.target.value }
                                })}
                                placeholder="123, Food Street, Bangalore"
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                            <input
                                type="checkbox"
                                checked={formData.isPureVeg}
                                onChange={(e) => setFormData({ ...formData, isPureVeg: e.target.checked })}
                                className="w-6 h-6 rounded-lg border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
                            />
                            <div>
                                <p className="text-sm font-black text-white italic">This is a Pure Vegetarian Outlet</p>
                                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-0.5">Show vegetarian badge to customers</p>
                            </div>
                        </div>

                        {/* Hero Image Section */}
                        <div className="space-y-8 pt-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                                <div className="p-3 bg-fuchsia-500/10 text-fuchsia-400 rounded-2xl border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5"><Camera size={24} /></div>
                                <h3 className="text-xl font-black text-white tracking-tight">Restaurant Hero Image</h3>
                            </div>

                            <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6">
                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Current Hero Preview</p>
                                <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-xl mb-6 bg-slate-900 aspect-video max-h-48 md:max-h-64">
                                    <img
                                        src={formData.heroImageUrl || 'https://res.cloudinary.com/dnpk9egyk/image/upload/v1770700974/zestify/images/restaurant-hero-light.jpg'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                        alt="Hero Preview"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs font-black uppercase tracking-widest">Live Preview</p>
                                    </div>
                                </div>

                                <label className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/10 hover:border-white/20 rounded-2xl cursor-pointer transition-all group">
                                    <ImageIcon className="text-white/40 group-hover:text-white transition-colors" size={20} />
                                    <span className="text-sm font-black text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">Upload / Replace Hero Image</span>
                                    <input type="file" className="hidden" onChange={handleHeroImageUpload} accept="image/*" />
                                </label>
                                <p className="text-[10px] text-white/30 font-bold italic mt-4 text-center">Recommended size: 1600x600 pixels for best appearance</p>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>

            <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-between shadow-2xl border border-white/10 overflow-hidden relative group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                <div className="flex items-center gap-6 z-10">
                    <div className="p-5 bg-blue-500/20 text-blue-400 rounded-3xl border border-blue-500/20 shadow-xl shadow-blue-500/10"><Settings size={32} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">Account Security</h2>
                        <p className="text-white/40 font-medium italic">Manage your merchant access and billing preferences</p>
                    </div>
                </div>
                <Button dark variant="outline" className="h-14 px-8 z-10 font-black uppercase tracking-widest text-[10px]">
                    Manage Password
                </Button>
            </div>
        </div>
    );
};

export default RestaurantProfile;
