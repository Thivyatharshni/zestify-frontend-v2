import React, { useEffect, useState } from 'react';
import OrderCard from '../components/orders/OrderCard';
import EmptyState from '../components/common/EmptyState';
import { orderApi } from '../services/orderApi';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/RouteConstants';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Orders = ({ embedded = false }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await orderApi.getOrders();
                setOrders(data || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                // Don't fall back to mock data - show empty state instead
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const Content = () => {
        if (loading) return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );

        return (
            <>
                <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Past Orders</h1>
                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                        <EmptyState
                            title="No orders yet"
                            description="Hungry? Start exploring restaurants and discover your next favorite meal!"
                            action={
                                <Link to={ROUTES.HOME}>
                                    <Button variant="primary" className="py-4 px-8 font-black uppercase text-sm tracking-widest shadow-lg shadow-blue-100">Browse Restaurants</Button>
                                </Link>
                            }
                        />
                    </div>
                )}
            </>
        );
    };

    if (embedded) {
        return <Content />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Content />
            </div>
        </div>
    );
};

export default Orders;
