import React, { useState, useEffect } from 'react';
import {
    Package,
    MapPin,
    ChevronRight,
    CheckCircle,
    XCircle,
    Navigation,
    Clock,
    Phone,
    Store,
    ArrowRight
} from 'lucide-react';
import {
    Card,
    Badge,
    Button,
    Loader,
    EmptyState,
    Modal
} from '../../components/ui/DashboardUI';
import { deliveryService } from '../../services/dashboard/deliveryService';
import toast from 'react-hot-toast';

const DeliveryOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await deliveryService.getOrders();
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error('No orders available');
            }
        } catch (error) {
            console.error('Orders fetch error:', error);
            // Provide more specific error messages
            if (error.response?.status === 401) {
                toast.error('Please log in as a delivery partner');
            } else if (error.response?.status === 403) {
                toast.error('Access denied. You must be a delivery partner');
            } else if (error.response?.status === 500) {
                toast.error('Server error. Please try again later');
            } else {
                toast.error('Failed to load assigned orders. Check your connection');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            const response = await deliveryService.acceptOrder(id);
            if (response.data.success) {
                toast.success('Order accepted! Head to the restaurant.');
                fetchOrders();
            }
        } catch (error) {
            toast.error('Could not accept order');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await deliveryService.updateOrderStatus(id, status);
            if (response.data.success) {
                toast.success(`Order status: ${status}`);
                setIsModalOpen(false);
                fetchOrders();
            }
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Assigned Tasks</h1>
                <p className="text-white/50 font-medium italic mt-1">Manage your active delivery missions</p>
            </div>

            {orders.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {orders.map((order) => (
                        <Card dark key={order._id} className="p-0 overflow-hidden group">
                            <div className="bg-white/10 p-6 text-white flex justify-between items-center border-b border-white/5 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/20">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-sm font-black tracking-widest text-blue-200 uppercase italic">Task #{order._id.slice(-6)}</span>
                                </div>
                                <Badge dark variant={order.orderStatus === 'PENDING_ASSIGNMENT' ? 'warning' : 'primary'}>
                                    {order.orderStatus === 'PENDING_ASSIGNMENT' ? 'AVAILABLE' : order.orderStatus}
                                </Badge>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Visual Route */}
                                <div className="relative">
                                    <div className="absolute left-6 top-8 bottom-8 w-1 border-l-2 border-dashed border-white/10" />

                                    <div className="flex gap-6 relative z-10">
                                        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                            <Store size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Pick up from</p>
                                            <h4 className="text-lg font-black text-white tracking-tight">{order.restaurant?.name}</h4>
                                            <p className="text-xs font-bold text-white/40 italic mt-1">{order.restaurant?.location?.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 relative z-10 mt-10">
                                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Deliver to</p>
                                            <h4 className="text-lg font-black text-white tracking-tight">{order.user?.name}</h4>
                                            <p className="text-xs font-bold text-white/40 italic mt-1">{order.address?.area}, {order.address?.city}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-6 rounded-[2rem] flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-xl text-white/30 border border-white/5"><Clock size={16} /></div>
                                        <span className="text-xs font-black text-white/50 uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-xl text-white/30 border border-white/5"><Phone size={16} /></div>
                                        <span className="text-xs font-black text-white/50 uppercase tracking-widest italic">+{order.user?.phone}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    {order.orderStatus === 'PENDING_ASSIGNMENT' ? (
                                        <>
                                            <Button dark onClick={() => handleAccept(order._id)} className="flex-1 h-14 rounded-2xl shadow-xl shadow-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 border-0">Accept Task</Button>
                                            <Button dark variant="outline" className="px-6 h-14 rounded-2xl hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all"><XCircle size={20} /></Button>
                                        </>
                                    ) : (
                                        <Button
                                            dark
                                            onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                                            className="flex-1 h-16 rounded-[2rem] shadow-2xl shadow-blue-600/30 text-sm font-black uppercase tracking-[0.2em] group gap-3 bg-blue-600 hover:bg-blue-500 border-0"
                                        >
                                            Update Delivery Status
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState dark title="Quiet Shift" message="No tasks assigned right now. Keep your APP online!" icon={Navigation} />
            )}

            {/* Status Update Modal */}
            <Modal
                dark
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Mission Progress"
                footer={<Button dark variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>}
            >
                <div className="space-y-6">
                    <p className="text-sm font-bold text-white/40 text-center px-4 italic mb-8">
                        Please select the current stage of this delivery mission. Correct status updates help customers track their food.
                    </p>

                    <div className="grid gap-4">
                        <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'PICKED_UP')}
                            className="flex items-center justify-between p-6 bg-white/5 border-2 border-white/5 rounded-3xl hover:bg-blue-500/10 hover:border-blue-500/20 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl shadow-sm text-blue-400 group-hover:scale-110 transition-transform border border-white/10"><CheckCircle size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Picked Up</h4>
                                    <p className="text-xs font-bold text-white/30 italic">I have received the food from kitchen</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-white/20" />
                        </button>

                        <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'OUT_FOR_DELIVERY')}
                            className="flex items-center justify-between p-6 bg-white/5 border-2 border-white/5 rounded-3xl hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl shadow-sm text-indigo-400 group-hover:scale-110 transition-transform border border-white/10"><Navigation size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">On My Way</h4>
                                    <p className="text-xs font-bold text-white/30 italic">Heading towards customer location</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-white/20" />
                        </button>

                        <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'DELIVERED')}
                            className="flex items-center justify-between p-6 bg-white/5 border-2 border-white/5 rounded-3xl hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl shadow-sm text-emerald-400 group-hover:scale-110 transition-transform border border-white/10"><CheckCircle size={24} /></div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Mission Complete</h4>
                                    <p className="text-xs font-bold text-white/30 italic">Food successfully delivered to customer</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-white/20" />
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DeliveryOrders;
