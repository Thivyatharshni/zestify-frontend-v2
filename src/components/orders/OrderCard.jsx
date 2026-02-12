import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, X } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import OrderStatusBadge from './OrderStatusBadge';
import Button from '../common/Button';
import { orderApi } from '../../services/orderApi';

const OrderCard = ({ order }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    // Backend properties: order.restaurant, order.items, order.totalPrice, order.status, order.createdAt, order.id / order._id
    const restaurant = order.restaurant || {};
    const orderId = order.id || order._id; // ✅ Optional defensive fallback

    const handleCancelOrder = async () => {
        setCancelling(true);
        try {
            await orderApi.cancelOrder(orderId);
            alert('Order cancelled successfully!');
            setShowCancelModal(false);
            // Optionally, refresh the page to update the order status
            window.location.reload();
        } catch (error) {
            alert('Failed to cancel order. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-5">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">
                            {restaurant.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                            {typeof restaurant.location === 'object' ? restaurant.location.address : restaurant.location}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                                ORDER #{orderId.slice(-6)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="text-[10px] text-gray-400 font-bold uppercase">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short'
                                })}{' '}
                                •{' '}
                                {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <OrderStatusBadge status={order.orderStatus || order.status} />
            </div>

            <div className="border-t border-dashed border-gray-100 py-4 space-y-2">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-500 font-bold">
                            <span className="text-blue-600">{item.quantity}</span> x {item.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-dashed border-gray-100 pt-4 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">
                        Total Paid
                    </span>
                    <span className="font-black text-gray-900 text-lg leading-none">
                        {formatPrice(order.bill?.grandTotal || order.totalPrice)}
                    </span>
                </div>
                <div className="flex gap-3">
                    {(order.orderStatus || order.status) === 'PLACED' && (
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest px-4 shadow-sm"
                            onClick={() => setShowCancelModal(true)}
                        >
                            Cancel Order
                        </Button>
                    )}
                    {['PLACED', 'CONFIRMED', 'PREPARING', 'PENDING_ASSIGNMENT', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.orderStatus || order.status) ? (
                        <Link to={`/orders/${orderId}`}>
                            <Button
                                variant="primary"
                                className="bg-blue-600 hover:bg-blue-700 font-black uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-blue-100"
                            >
                                Track Live
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="outline"
                            className="text-gray-900 border-gray-200 hover:bg-gray-50 font-black uppercase text-[10px] tracking-widest px-6 shadow-sm"
                        >
                            <RefreshCw size={12} className="mr-2" /> Reorder
                        </Button>
                    )}
                </div>
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-lg text-gray-900">Cancel Order</h3>
                            <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 text-gray-600 border-gray-200"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Keep Order
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Order'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCard;
