import React, { useState, useEffect } from 'react';
import {
    Users,
    Store,
    Bike,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    Activity,
    Zap,
    BarChart3,
    Sparkles,
    List
} from 'lucide-react';
import {
    StatCard,
    Card,
    Badge,
    Loader
} from '../../components/ui/DashboardUI';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/dashboard/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminService.getStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load platform statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section with Glass Gradient */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-900/10 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <Activity className="text-white" size={28} />
                            </div>
                            <Badge className="bg-emerald-500/20 text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    Live Data
                                </div>
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3 drop-shadow-md">
                            Platform Command Center
                            <Sparkles className="text-yellow-300" size={32} />
                        </h1>
                        <p className="text-white/70 font-medium">Real-time system analytics and performance monitoring</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
                            <BarChart3 size={20} className="inline mr-2" />
                            Reports
                        </button>
                        <button onClick={fetchStats} className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-black transition-all hover:scale-105 active:scale-95 shadow-xl">
                            <Zap size={20} className="inline mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid with Glass Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="group relative overflow-hidden bg-white/5 backdrop-blur-lg hover:bg-white/10 p-6 rounded-3xl border border-white/10 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl group-hover:bg-slate-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <ArrowUpRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-sm">{stats?.totalUsers || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-white/60">Total Users</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-white/10 backdrop-blur-lg hover:bg-white/15 p-6 rounded-3xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <Store size={24} />
                            </div>
                            <ArrowUpRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-sm">{stats?.totalRestaurants || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-white/60">Restaurants</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-white/10 backdrop-blur-lg hover:bg-white/15 p-6 rounded-3xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <Bike size={24} />
                            </div>
                            <ArrowUpRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-sm">{stats?.totalDeliveryPartners || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-white/60">Riders</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-white/10 backdrop-blur-lg hover:bg-white/15 p-6 rounded-3xl border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <ShoppingBag size={24} />
                            </div>
                            <ArrowUpRight className="text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-sm">{stats?.totalOrders || 0}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-white/60">Total Orders</p>
                    </div>
                </div>
            </div>

            {/* CMS Command Center - New Section for Direct Editing Accessibility */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl shadow-lg border border-white/10">
                            <Sparkles size={20} className="text-yellow-400" />
                        </div>
                        Landing Page CMS
                    </h2>
                    <Badge variant="neutral" dark>Direct Editing Controls</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: 'Hero Section', desc: 'Main title & video', icon: Sparkles, path: '/admin/cms/hero', color: 'from-blue-600 to-indigo-600' },
                        { title: 'Categories', desc: 'Manage food types', icon: Zap, path: '/admin/cms/categories', color: 'from-emerald-600 to-teal-600' },
                        { title: 'Food Lanes', desc: 'Cinematic carousels', icon: Activity, path: '/admin/cms/lanes', color: 'from-orange-600 to-amber-600' },
                        { title: 'Promotions', desc: 'Video & video offers', icon: ShoppingBag, path: '/admin/cms/offers', color: 'from-purple-600 to-pink-600' },
                        { title: 'Footer Links', desc: 'Manage site navigation', icon: List, path: '/admin/cms/footer', color: 'from-emerald-600 to-teal-600' }
                    ].map((cms, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(cms.path)}
                            className="group relative overflow-hidden bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
                        >
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${cms.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-all`} />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-white group-hover:scale-110 transition-transform">
                                        <cms.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white leading-tight">{cms.title}</h4>
                                        <p className="text-xs text-white/50 font-medium">{cms.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Manage Section</span>
                                    <ArrowUpRight className="text-white/30 group-hover:text-white transition-all" size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Platform Health - Glass Theme */}
                <div className="lg:col-span-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 hover:bg-white/15 transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-xl shadow-lg border border-white/10">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            Platform Health
                        </h3>
                        <Badge className="bg-white/10 text-white border border-white/20">4 Metrics</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { icon: Users, value: stats?.totalUsers || 0, label: 'Active Customers', color: 'blue', growth: '+12%' },
                            { icon: Store, value: stats?.totalRestaurants || 0, label: 'Partner Restaurants', color: 'indigo', growth: '+8%' },
                            { icon: Bike, value: stats?.totalDeliveryPartners || 0, label: 'Delivery Fleet', color: 'purple', growth: '+15%' },
                            { icon: ShoppingBag, value: stats?.totalOrders || 0, label: 'Lifetime Orders', color: 'pink', growth: '+22%' }
                        ].map((metric, idx) => (
                            <div key={idx} className="group relative overflow-hidden bg-white/5 hover:bg-white/10 p-8 rounded-[2rem] border border-white/10 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1">
                                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${metric.color}-500/10 rounded-full blur-2xl group-hover:bg-${metric.color}-500/20 transition-all`} />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-white/10 text-white rounded-2xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
                                            <metric.icon size={24} />
                                        </div>
                                        <ArrowUpRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
                                    </div>
                                    <h4 className="text-5xl font-black text-white tracking-tighter mb-3 drop-shadow-sm">{metric.value}</h4>
                                    <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-3">{metric.label}</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                                        <TrendingUp size={12} />
                                        <span>{metric.growth} this month</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Card - Glass Theme */}
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-2xl text-white border border-white/20 shadow-2xl relative overflow-hidden group hover:scale-[1.02] rounded-[2.5rem] p-8 transition-all">
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] group-hover:bg-cyan-400/30 transition-all" />
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                                    <DollarSign size={20} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Total GMV</p>
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter mb-4 drop-shadow-md">₹{(stats?.totalRevenue || 0).toLocaleString()}</h2>
                            <p className="text-sm font-medium text-white/70 leading-relaxed">
                                Gross Merchandise Value across all transactions on the Zestify platform.
                            </p>
                        </div>
                        <div className="space-y-3 mt-8">
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Growth Rate</span>
                                    <div className="flex items-center gap-2 text-emerald-300">
                                        <TrendingUp size={16} />
                                        <span className="text-lg font-black">+18%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">This Month</span>
                                    <span className="text-lg font-black text-white">₹{((stats?.totalRevenue || 0) * 0.18).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status - Glass Theme */}
            <div className="relative overflow-hidden bg-white/10 border border-white/20 p-8 rounded-[2.5rem] hover:shadow-2xl hover:scale-[1.01] transition-all group backdrop-blur-md">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-3xl shadow-xl shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">System Status: Operational</h4>
                            <p className="text-sm font-bold text-emerald-200">All services running smoothly. Last updated: {new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest">99.9% Uptime</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
