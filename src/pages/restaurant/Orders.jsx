import React, { useState, useEffect } from 'react';
import {
    ShoppingBag,
    MapPin,
    Phone,
    User,
    Clock,
    ChevronRight,
    Filter,
    CheckCircle,
    Package,
    Truck,
    XCircle,
    Eye
} from 'lucide-react';
import {
    Card,
    Badge,
    Button,
    Table,
    Modal,
    Pagination,
    Loader,
    EmptyState
} from '../../components/ui/DashboardUI';
import { restaurantApi } from '../../services/dashboard/restaurantService';
import toast from 'react-hot-toast';

const statuses = [
    { label: 'All Orders', value: '' },
    { label: 'New', value: 'PLACED' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' }
];

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [page, activeTab]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await restaurantApi.getOrders({
                page,
                limit: 8,
                status: activeTab
            });
            if (response.data.success) {
                setOrders(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await restaurantApi.updateOrderStatus(orderId, newStatus);
            if (response.data.success) {
                toast.success(`Order marked as ${newStatus}`);
                fetchOrders();
                setIsDetailModalOpen(false);
            }
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const statusVariants = {
        PLACED: 'neutral',
        CONFIRMED: 'primary',
        PREPARING: 'warning',
        OUT_FOR_DELIVERY: 'blue',
        DELIVERED: 'success',
        CANCELLED: 'danger'
    };

    return (
        <div className="space-y-8">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Order Management</h1>
                    <p className="text-white/50 font-medium italic mt-1">Track and update active customer orders</p>
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {statuses.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => { setActiveTab(s.value); setPage(1); }}
                        className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === s.value
                            ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20 active:scale-95'
                            : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white backdrop-blur-md'
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader dark />
            ) : orders.length > 0 ? (
                <>
                    <Table dark headers={['Order ID', 'Customer', 'Items', 'Amount', 'Time', 'Status', 'Actions']}>
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0 font-medium">
                                <td className="px-6 py-5">
                                    <span className="text-xs font-black text-white uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-white tracking-tight">{order.user?.name}</span>
                                        <span className="text-xs font-bold text-white/40 italic">+{order.user?.phone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="text-xs font-bold text-white/80">
                                                {item.quantity}x {item.name}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-black text-white">₹{order.bill.grandTotal}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5 text-white/30">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <Badge dark variant={statusVariants[order.orderStatus]}>{order.orderStatus.replace(/_/g, ' ')}</Badge>
                                </td>
                                <td className="px-6 py-5">
                                    <Button
                                        dark
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                                    >
                                        <Eye size={16} />
                                        Details
                                    </Button>
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
                <EmptyState dark title="No Orders" message="We couldn't find any orders matching your selection." icon={ShoppingBag} />
            )}

            {/* Detail Modal */}
            <Modal
                dark
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title={`Order Details - #${selectedOrder?._id.slice(-6)}`}
                footer={(
                    <div className="flex gap-3 w-full justify-between items-center">
                        <div className="flex gap-2">
                            {selectedOrder?.orderStatus === 'PLACED' && (
                                <Button dark onClick={() => handleUpdateStatus(selectedOrder._id, 'CONFIRMED')} className="bg-blue-500 hover:bg-blue-600 border-0">Accept Order</Button>
                            )}
                            {selectedOrder?.orderStatus === 'CONFIRMED' && (
                                <Button dark onClick={() => handleUpdateStatus(selectedOrder._id, 'PREPARING')} className="bg-amber-500 hover:bg-amber-600 border-0">Start Cooking</Button>
                            )}
                            {selectedOrder?.orderStatus === 'PREPARING' && (
                                <Button dark onClick={() => handleUpdateStatus(selectedOrder._id, 'PENDING_ASSIGNMENT')} className="bg-indigo-500 hover:bg-indigo-600 border-0">Ready for Pickup</Button>
                            )}
                        </div>
                        <Button dark variant="ghost" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
                    </div>
                )}
            >
                <div className="space-y-8">
                    {/* Status Progress */}
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                        <div className="flex flex-col items-center gap-2">
                            <div className={`p-3 rounded-2xl ${['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder?.orderStatus) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                                <Package size={20} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Order</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-white/5 mx-2" />
                        <div className="flex flex-col items-center gap-2">
                            <div className={`p-3 rounded-2xl ${['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder?.orderStatus) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                                <CheckCircle size={20} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Confirm</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-white/5 mx-2" />
                        <div className="flex flex-col items-center gap-2">
                            <div className={`p-3 rounded-2xl ${['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder?.orderStatus) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                                <Utensils size={20} className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Cook</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-white/5 mx-2" />
                        <div className="flex flex-col items-center gap-2">
                            <div className={`p-3 rounded-2xl ${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder?.orderStatus) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                                <Truck size={20} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Deliver</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} className="text-blue-400" /> Customer Info
                            </h4>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-sm font-black text-white">{selectedOrder?.user?.name}</p>
                                <p className="text-xs font-bold text-white/40 italic mt-1 flex items-center gap-1.5 underline decoration-blue-500/20 decoration-2">
                                    <Phone size={12} /> {selectedOrder?.user?.phone}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={14} className="text-blue-400" /> Delivery Address
                            </h4>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-[11px] font-bold text-white/70 leading-relaxed italic">
                                    {selectedOrder?.address?.flatNo}, {selectedOrder?.address?.area}<br />
                                    {selectedOrder?.address?.landmark}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <ShoppingBag size={14} className="text-blue-400" /> Order Details
                        </h4>
                        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-sm backdrop-blur-md">
                            <div className="divide-y divide-white/5">
                                {selectedOrder?.items.map((item, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-400 border border-blue-500/20">
                                                {item.quantity}x
                                            </div>
                                            <span className="text-sm font-bold text-white/80">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-white">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white/10 p-6 text-white flex justify-between items-center border-t border-white/10">
                                <span className="text-xs font-black uppercase tracking-widest text-white/40 italic">Bill Total</span>
                                <span className="text-2xl font-black italic tracking-tighter">₹{selectedOrder?.bill.grandTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const Utensils = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
);

export default RestaurantOrders;
