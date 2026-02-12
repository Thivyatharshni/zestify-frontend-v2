import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import OrderTimeline from '../components/orders/OrderTimeline';
import { orderApi } from '../services/orderApi';
import { Loader2, ArrowLeft, MapPin } from 'lucide-react';
import { ROUTES } from '../routes/RouteConstants';

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await orderApi.getOrderById(id);
            setOrder(data);
        } catch (error) {
            console.error("Failed to fetch order tracking details:", error);
            setOrder(null);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();

        // Polling for live status
        const interval = setInterval(() => {
            fetchOrderDetails(false);
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white mt-12 md:mt-16">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 mt-12 md:mt-16">
            <div className="text-gray-400 mb-4 text-6xl">?</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6 font-medium">We couldn't find the order you're looking for.</p>
            <Link to={ROUTES.ORDERS}>
                <button className="bg-gray-900 text-white font-black uppercase text-xs tracking-widest px-8 py-4 rounded-2xl shadow-xl shadow-gray-200">View All Orders</button>
            </Link>
        </div>
    );

    const restaurant = order.restaurant || {};

    const getStatusText = (status) => {
        switch (status) {
            case 'PLACED': return 'Order Placed';
            case 'CONFIRMED': return 'Confirmed';
            case 'PREPARING': return 'Kitchen is preparing';
            case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
            case 'DELIVERED': return 'Order Delivered';
            case 'CANCELLED': return 'Order Cancelled';
            default: return 'Processing';
        }
    };

    return (
        <div className="min-h-screen bg-white mt-12 md:mt-16">
            <div className="bg-gray-900 text-white p-6 pb-20">
                <div className="max-w-2xl mx-auto">
                    <Link to={ROUTES.ORDERS} className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Orders</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-3xl font-black mb-2 tracking-tighter">{getStatusText(order.orderStatus || order.status)}</h1>
                        <div className="text-5xl font-black text-blue-500 mb-4 tracking-tighter">
                            {(order.orderStatus || order.status) === 'DELIVERED' ? '✓' : (order.orderStatus || order.status) === 'CANCELLED' ? '✕' : (order.eta || 'Preparing')}
                        </div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Order #{(order._id || order.id).slice(-6)} • {restaurant.name}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto -mt-12 px-4 mb-20">
                <div className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-8">
                    <div className="flex items-center gap-5 mb-10 border-b border-gray-100 pb-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-black text-xl text-gray-900 leading-tight mb-1">{restaurant.name}</h3>
                            <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                <MapPin size={14} className="mr-1 text-blue-500" />
                                <span className="truncate">
                                    {typeof restaurant.location === 'object' ? restaurant.location.address : restaurant.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    <OrderTimeline status={order.orderStatus || order.status} />
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
