import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    ShoppingBag,
    Search,
    MapPin,
    Store,
    User,
    Calendar,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import {
    Card,
    Badge,
    Table,
    Loader,
    EmptyState,
    cn
} from '../../components/ui/DashboardUI';
import { adminService } from '../../services/dashboard/adminService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const highlightId = location.state?.highlightId;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await adminService.getOrders();
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const statusVariants = {
        PLACED: 'neutral',
        CONFIRMED: 'primary',
        PREPARING: 'warning',
        PENDING_ASSIGNMENT: 'warning',
        ACCEPTED: 'primary',
        OUT_FOR_DELIVERY: 'primary',
        DELIVERED: 'success',
        CANCELLED: 'danger'
    };

    const filteredOrders = orders.filter(order =>
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = orders.reduce((sum, order) => sum + (order.bill?.grandTotal || 0), 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                    <ShoppingBag className="text-white" size={28} />
                                </div>
                                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-md">
                                    Global Order Monitor
                                    <Sparkles className="text-yellow-300" size={28} />
                                </h1>
                            </div>
                            <p className="text-white/70 font-medium">Real-time view of all platform orders</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-lg">
                            <Calendar size={18} className="text-white" />
                            <span className="text-sm font-black text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Orders</p>
                                    <h3 className="text-3xl font-black text-white">{orders.length}</h3>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Today's Orders</p>
                                    <h3 className="text-3xl font-black text-white">{todayOrders}</h3>
                                </div>
                                <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <TrendingUp className="text-emerald-300" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Revenue</p>
                                    <h3 className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</h3>
                                </div>
                                <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <TrendingUp className="text-yellow-300" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glass Search Bar */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all shadow-xl rounded-[2rem] p-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={22} />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer, or restaurant..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/10 transition-all text-base font-bold text-white placeholder:text-white/40 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredOrders.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <Table headers={['Order ID', 'Customer', 'Restaurant', 'Amount', 'Time', 'Status']} dark>
                        {filteredOrders.map((order) => (
                            <tr
                                key={order._id}
                                className={cn(
                                    "hover:bg-white/5 transition-all border-b border-white/5 last:border-0",
                                    highlightId === order._id && "bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-500/30 scale-[1.01] z-10 relative"
                                )}
                            >
                                <td className="px-6 py-5">
                                    <span className="text-sm font-black text-white/60 uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 text-white rounded-xl border border-white/20 backdrop-blur-sm">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <span className="text-base font-bold text-white block">{order.user?.name}</span>
                                            <span className="text-sm font-bold text-white/60">+{order.user?.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 text-white rounded-xl border border-white/20 backdrop-blur-sm">
                                            <Store size={18} />
                                        </div>
                                        <span className="text-base font-bold text-white">{order.restaurant?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-base font-black text-white">₹{order.bill?.grandTotal}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-white/80">
                                        {new Date(order.createdAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <Badge variant={statusVariants[order.orderStatus]} dark className="shadow-sm shadow-black/5">
                                        {order.orderStatus.replace(/_/g, ' ')}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            ) : (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                    <EmptyState title="No Orders" message="No orders match your search criteria." icon={ShoppingBag} dark />
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
