import React, { useState, useEffect } from 'react';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUpRight,
    Download,
    CreditCard,
    DollarSign
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Card,
    StatCard,
    Badge,
    Loader,
    Button
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const RiderEarnings = () => {
    const [earnings, setEarnings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            const response = await deliveryService.getEarnings();
            if (response.data.success) {
                setEarnings(response.data.data);
            } else {
                toast.error('No earnings data available');
            }
        } catch (error) {
            console.error('Earnings fetch error:', error);
            // Provide more specific error messages
            if (error.response?.status === 401) {
                toast.error('Please log in as a delivery partner');
            } else if (error.response?.status === 403) {
                toast.error('Access denied. You must be a delivery partner');
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please try again later');
            } else {
                toast.error('Failed to load earnings data. Check your connection');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Earnings Reports</h1>
                    <p className="text-white/50 font-medium italic mt-1">Detailed breakdown of your delivery revenue</p>
                </div>
                <Button dark variant="outline" className="gap-2 px-6 h-12 shadow-sm italic text-[10px] font-black uppercase tracking-widest">
                    <Download size={18} />
                    Statement PDF
                </Button>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    dark
                    title="Today's Earnings"
                    value={`₹${earnings?.todayEarnings || 0}`}
                    icon={TrendingUp}
                    color="blue"
                    trend="up"
                    trendValue="8% vs yesterday"
                />
                <StatCard
                    dark
                    title="Total Deliveries"
                    value={earnings?.totalDeliveries || 0}
                    icon={Calendar}
                    color="emerald"
                />
                <StatCard
                    dark
                    title="Wallet Balance"
                    value={`₹${earnings?.totalEarnings || 0}`}
                    icon={Wallet}
                    color="indigo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Earnings Chart */}
                <Card dark className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <TrendingUp className="text-blue-400" />
                            Weekly Performance
                        </h3>
                        <Badge dark variant="primary">Last 7 Days</Badge>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earnings?.weeklyEarningsChart || []}>
                                <defs>
                                    <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        backdropFilter: 'blur(12px)',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                        padding: '20px',
                                        fontWeight: 900,
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#payoutGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Payout Summary */}
                <div className="space-y-6">
                    <Card dark className="border-none shadow-2xl relative overflow-hidden group bg-white/5 backdrop-blur-xl">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Next Payout</p>
                            <h2 className="text-4xl font-black mt-2 tracking-tighter italic text-white">₹{earnings?.totalEarnings > 500 ? (earnings.totalEarnings * 0.9).toFixed(0) : 0}</h2>
                            <p className="text-xs font-medium text-white/40 mt-4 leading-relaxed group-hover:text-white/60 transition-colors">
                                Your earnings are automatically transferred to your bank account every Monday.
                            </p>
                            <Button dark className="w-full mt-8 bg-blue-600 text-white hover:bg-blue-500 gap-2 h-14 rounded-2xl group/btn border-0">
                                <CreditCard size={20} />
                                <span className="font-black uppercase tracking-widest text-[10px]">Withdraw Now</span>
                            </Button>
                        </div>
                    </Card>

                    <Card dark className="border-dashed border-white/10">
                        <h4 className="text-xs font-black text-white/30 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Revenue Breakdown</h4>
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-xl text-white/30 border border-white/5"><DollarSign size={16} /></div>
                                    <span className="text-sm font-bold text-white/60">Base Pay</span>
                                </div>
                                <span className="text-sm font-black text-white">₹{(earnings?.totalEarnings * 0.7).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><ArrowUpRight size={16} /></div>
                                    <span className="text-sm font-bold text-white/60">Incentives</span>
                                </div>
                                <span className="text-sm font-black text-white">₹{(earnings?.totalEarnings * 0.2).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20"><CreditCard size={16} /></div>
                                    <span className="text-sm font-bold text-white/60">Tips Received</span>
                                </div>
                                <span className="text-sm font-black text-white">₹{(earnings?.totalEarnings * 0.1).toFixed(0)}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RiderEarnings;
