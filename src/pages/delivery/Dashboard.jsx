import React, { useState, useEffect } from 'react';
import {
    Bike,
    MapPin,
    Power,
    TrendingUp,
    Package,
    CheckCircle2,
    Navigation,
    Clock,
    ExternalLink
} from 'lucide-react';
import {
    StatCard,
    Card,
    Button,
    Badge,
    Loader,
    EmptyState
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const DeliveryDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [earnings, setEarnings] = useState(null);
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        // Set up location tracking simulation
        const interval = setInterval(updateLocation, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [profileRes, earningsRes, ordersRes] = await Promise.all([
                deliveryService.getProfile(),
                deliveryService.getEarnings(),
                deliveryService.getOrders({ status: 'ACCEPTED' })
            ]);

            if (profileRes.data.success) setProfile(profileRes.data.data);
            if (earningsRes.data.success) setEarnings(earningsRes.data.data);
            if (ordersRes.data.success) setActiveOrders(ordersRes.data.data);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            // Provide more specific error messages
            if (error.response?.status === 401) {
                toast.error('Please log in as a delivery partner');
            } else if (error.response?.status === 403) {
                toast.error('Access denied. You must be a delivery partner');
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please try again later');
            } else {
                toast.error('Failed to load rider dashboard. Check your connection');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleOnline = async () => {
        try {
            const response = await deliveryService.toggleOnline();
            if (response.data.success) {
                setProfile({ ...profile, isOnline: response.data.isOnline });
                toast.success(`You are now ${response.data.isOnline ? 'ONLINE' : 'OFFLINE'}`);
            }
        } catch (error) {
            toast.error('Failed to change status');
        }
    };

    const updateLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    await deliveryService.updateLocation(position.coords.latitude, position.coords.longitude);
                } catch (error) {
                    console.error('Location update failed');
                }
            });
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8">
            {/* Rider Status Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                <div className="flex items-center gap-6 z-10">
                    <div className="relative">
                        <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-400">
                            <Bike size={32} />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#070b14] ${profile?.isOnline ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter">Welcome back, {profile?.name}!</h1>
                        <p className="text-white/40 font-medium italic mt-1 font-medium">
                            {profile?.isOnline ? 'Hunting for new orders...' : 'Go online to start earning'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={toggleOnline}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all z-10 border ${profile?.isOnline
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500 hover:text-white'
                        : 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95'
                        }`}
                >
                    <Power size={18} />
                    {profile?.isOnline ? 'Go Offline' : 'Go Online'}
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard dark title="Today's Earnings" value={`₹${earnings?.todayEarnings || 0}`} icon={TrendingUp} color="blue" />
                <StatCard dark title="Deliveries Done" value={earnings?.totalDeliveries || 0} icon={CheckCircle2} color="emerald" />
                <StatCard dark title="Wallet Balance" value={`₹${earnings?.totalEarnings || 0}`} icon={Package} color="indigo" />
                <StatCard dark title="Vehicle Reg" value={profile?.vehicleNumber || 'N/A'} icon={Navigation} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Task */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <Clock className="text-blue-400" />
                            Current Mission
                        </h3>
                        {activeOrders.length > 0 && <Badge dark variant="primary">Active</Badge>}
                    </div>

                    {activeOrders.length > 0 ? (
                        activeOrders.map(order => (
                            <Card dark key={order._id} className="p-0 overflow-hidden border-blue-500/10 hover:border-blue-500/30 transition-all bg-white/5 backdrop-blur-md">
                                <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-white/30 uppercase tracking-widest">Order ID:</span>
                                            <span className="text-sm font-black text-white">#{order._id.slice(-6)}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl h-fit border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Pick up at</p>
                                                <h4 className="text-lg font-black text-white tracking-tight">{order.restaurant?.name}</h4>
                                                <p className="text-xs font-bold text-white/40 italic mt-1 underline decoration-blue-500/20 decoration-4">{order.restaurant?.location?.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl h-fit border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                                <Navigation size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Deliver to</p>
                                                <h4 className="text-lg font-black text-white tracking-tight">{order.user?.name}</h4>
                                                <p className="text-xs font-bold text-white/40 italic mt-1 underline decoration-blue-500/20 decoration-4">{order.address?.area}, {order.address?.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-end gap-6 bg-white/5 p-6 md:w-64 rounded-[2rem] border border-white/5">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Payout</p>
                                            <h3 className="text-3xl font-black text-white italic tracking-tighter">₹{order.bill?.deliveryFee || 40}</h3>
                                        </div>
                                        <Button dark className="w-full flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 py-4 font-black uppercase tracking-widest text-[10px]">
                                            Update Task
                                            <ChevronRight size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <EmptyState
                            dark
                            title="Resting Mode"
                            message={profile?.isOnline ? "No active orders assigned to you yet. Stay online!" : "You are currently offline. Go online to see available orders."}
                            icon={Bike}
                        />
                    )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-white tracking-tight">Quick Actions</h3>
                    <Card dark className="p-2 border-dashed border-white/10">
                        <div className="space-y-1">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg shadow-blue-500/5">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-sm font-black text-white/70">Scan Package</span>
                                </div>
                                <ChevronRight size={18} className="text-white/20" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg shadow-emerald-500/5">
                                        <ExternalLink size={20} />
                                    </div>
                                    <span className="text-sm font-black text-white/70">Open Maps</span>
                                </div>
                                <ChevronRight size={18} className="text-white/20" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-all shadow-lg shadow-purple-500/5">
                                        <User size={20} />
                                    </div>
                                    <span className="text-sm font-black text-white/70">Contact Support</span>
                                </div>
                                <ChevronRight size={18} className="text-white/20" />
                            </button>
                        </div>
                    </Card>

                    {/* Safety Banner */}
                    <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group/safety">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black tracking-tight leading-tight">Safety First!</h4>
                            <p className="text-xs font-bold text-blue-100 mt-2 leading-relaxed italic">Always wear your helmet and follow speed limits during delivery missions.</p>
                        </div>
                        <Bike className="absolute -bottom-6 -right-6 text-white/10 group-hover/safety:scale-110 transition-transform duration-700" size={100} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const User = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const ChevronRight = ({ className, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

export default DeliveryDashboard;
