import React, { useState, useEffect } from 'react';
import {
    History as HistoryIcon,
    MapPin,
    CheckCircle,
    Calendar,
    Store,
    User
} from 'lucide-react';
import {
    Card,
    Badge,
    Table,
    Pagination,
    Loader,
    EmptyState
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const DeliveryHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchHistory();
    }, [page]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await deliveryService.getHistory({ page, limit: 10 });
            if (response.data.success) {
                setHistory(response.data.data);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error('No history available');
            }
        } catch (error) {
            console.error('History fetch error:', error);
            // Provide more specific error messages
            if (error.response?.status === 401) {
                toast.error('Please log in as a delivery partner');
            } else if (error.response?.status === 403) {
                toast.error('Access denied. You must be a delivery partner');
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please try again later');
            } else {
                toast.error('Failed to load delivery history. Check your connection');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Trip History</h1>
                    <p className="text-white/50 font-medium italic mt-1">Complete record of all your successful deliveries</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 shadow-sm backdrop-blur-md">
                    <Calendar size={18} className="text-blue-400" />
                    <span className="text-sm font-black text-white/70">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {history.length > 0 ? (
                <>
                    <Table dark headers={['Order ID', 'Restaurant', 'Customer', 'Delivered At', 'Payout', 'Status']}>
                        {history.map((order) => (
                            <tr key={order._id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                <td className="px-6 py-5">
                                    <span className="text-xs font-black text-white/30 uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                                            <Store size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-white/80">{order.restaurant?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-white/80 block">{order.user?.name}</span>
                                            <span className="text-xs font-bold text-white/30 italic">{order.deliveryAddress?.area}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-white/40">
                                        {new Date(order.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-black text-white">₹{order.bill?.deliveryFee || 40}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <Badge dark variant="success">
                                        <CheckCircle size={12} className="inline mr-1" />
                                        Completed
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </Table>
                    <Pagination
                        dark
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            ) : (
                <EmptyState
                    dark
                    title="No History Yet"
                    message="Your completed deliveries will appear here once you finish your first mission."
                    icon={HistoryIcon}
                />
            )}
        </div>
    );
};

export default DeliveryHistory;
