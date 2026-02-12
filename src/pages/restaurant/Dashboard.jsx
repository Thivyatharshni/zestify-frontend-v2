import React, { useEffect, useState } from 'react';
import {
    ShoppingBag,
    TrendingUp,
    Clock,
    XCircle,
    ArrowUpRight,
    DollarSign,
    Package,
    Calendar
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Card, StatCard, Badge, Table, Loader } from '../../components/ui/DashboardUI';
import { restaurantApi } from '../../services/dashboard/restaurantService';
import toast from 'react-hot-toast';

const RestaurantDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await restaurantApi.getStats();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader dark />;
    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Performance Overview</h1>
                    <p className="text-white/50 font-medium italic mt-1">Real-time insights for your restaurant business</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shadow-sm backdrop-blur-sm">
                    <Calendar size={18} className="text-blue-400" />
                    <span className="text-sm font-black text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    dark
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="green"
                    trend="up"
                    trendValue="12% from last wk"
                />
                <StatCard
                    dark
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="blue"
                />
                <StatCard
                    dark
                    title="Today's Orders"
                    value={stats.todayOrders}
                    icon={Clock}
                    color="orange"
                />
                <StatCard
                    dark
                    title="Cancelled"
                    value={stats.cancelledOrders}
                    icon={XCircle}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weekly Revenue Chart */}
                <Card dark className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <TrendingUp className="text-blue-400" />
                            Revenue Analytics
                        </h3>
                        <Badge dark variant="primary">Last 7 Days</Badge>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.weeklyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                                        padding: '12px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Selling Items */}
                <Card dark>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <Package className="text-blue-400" />
                            Top Sellers
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {stats.topSellingItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-black text-white/40 border border-white/10 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{item.count} Sold</p>
                                    </div>
                                </div>
                                <ArrowUpRight size={18} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xs font-bold text-blue-400 leading-relaxed uppercase tracking-widest text-center">
                            Boost your top items with dynamic offers!
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
