import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/RouteConstants';
import CartList from '../components/cart/CartList';
import PriceSummary from '../components/cart/PriceSummary';
import CouponInput from '../components/cart/CouponInput';
import AddressModal from '../components/cart/AddressModal';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { restaurantApi } from '../services/restaurantApi';
import { addressApi } from '../services/addressApi';
import { MapPin, User as UserIcon, CreditCard, Loader2 } from 'lucide-react';

const Cart = () => {
    const { state: cartState } = useCart();
    const { user } = useAuth();
    const [restaurant, setRestaurant] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartDetails = async () => {
            setLoading(true);
            try {
                if (cartState.restaurantId) {
                    const rest = await restaurantApi.getRestaurantById(cartState.restaurantId);
                    setRestaurant(rest);
                }
                if (user) {
                    const userAddresses = await addressApi.getAddresses();
                    setAddresses(userAddresses || []);
                    if (userAddresses && userAddresses.length > 0) {
                        const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0];
                        setSelectedAddress(defaultAddr);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch cart details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartDetails();
    }, [cartState.restaurantId, user]);

    if (cartState.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 mt-12 md:mt-16">
                <EmptyState
                    title="Your cart is empty"
                    description="You can go to home page to view more restaurants"
                    action={
                        <Link to={ROUTES.HOME}>
                            <Button variant="primary" className="uppercase font-bold tracking-wide">
                                See Restaurants Near You
                            </Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-12 md:mt-16">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-6 md:py-10 px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    {/* Left Section: User Info & Checkout Steps */}
                    <div className="w-full lg:flex-1 space-y-5">

                        {/* Account Section */}
                        <div className="bg-white p-5 md:p-7 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="w-11 h-11 bg-gray-900 rounded-lg text-white flex items-center justify-center flex-shrink-0">
                                        <UserIcon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Account</h3>
                                        {!user ? (
                                            <p className="text-gray-700 font-semibold text-base">Log in to place your order</p>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-lg">{user.name}</span>
                                                <span className="text-gray-600 text-sm font-medium">{user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!user && (
                                    <Link to={ROUTES.LOGIN}>
                                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 px-5 py-2 rounded-lg text-sm font-bold transition-all">
                                            Log In
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Delivery Address - Highlighted */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-5 md:p-7 rounded-xl shadow-sm border border-blue-200 transition-all hover:shadow-md">
                            <div className="flex gap-4 items-start">
                                <div className="w-11 h-11 bg-white rounded-lg text-blue-600 border border-blue-200 shadow-sm flex items-center justify-center flex-shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Delivery Address</h3>
                                        <Button
                                            variant="ghost"
                                            className="text-blue-600 hover:bg-blue-100/60 px-3 py-1.5 -mr-2 rounded-md flex items-center gap-1.5 text-sm font-bold transition-all"
                                            onClick={() => setIsAddressModalOpen(true)}
                                        >
                                            <span className="hidden sm:inline">{addresses.length > 0 ? "Change" : "Add New"}</span>
                                            <span className="sm:hidden">{addresses.length > 0 ? "Edit" : "Add"}</span>
                                        </Button>
                                    </div>

                                    {selectedAddress ? (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                                <p className="font-bold text-gray-900 text-xs uppercase tracking-widest">{selectedAddress.label || selectedAddress.type || 'Home'}</p>
                                            </div>
                                            <p className="text-gray-800 text-base md:text-lg leading-relaxed font-semibold">
                                                {selectedAddress.address ||
                                                    `${selectedAddress.street || ''}, ${selectedAddress.area || ''}, ${selectedAddress.city || ''} - ${selectedAddress.pincode || ''}`
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-base font-medium">Select address to proceed with checkout</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <AddressModal
                            isOpen={isAddressModalOpen}
                            onClose={() => setIsAddressModalOpen(false)}
                            addresses={addresses}
                            onSelect={setSelectedAddress}
                            onAddressAdded={(newAddr) => {
                                setAddresses(prev => [newAddr, ...prev]);
                                setSelectedAddress(newAddr);
                            }}
                        />

                        {/* Payment Section */}
                        <div className={`bg-white p-5 md:p-7 rounded-xl shadow-sm border border-gray-200 transition-all ${!selectedAddress ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'}`}>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="w-11 h-11 bg-gray-100 rounded-lg text-gray-400 flex items-center justify-center flex-shrink-0">
                                        <CreditCard size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Payment</h3>
                                        <p className="text-gray-700 text-sm font-semibold">Select method on next step</p>
                                    </div>
                                </div>
                                {selectedAddress && (
                                    <div className="text-gray-300">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Cart Summary */}
                    <div className="w-full lg:w-[440px] xl:w-[480px] lg:sticky lg:top-6">
                        <div className="bg-white p-6 md:p-8 shadow-md rounded-xl border border-gray-200">

                            {/* Restaurant Header */}
                            {restaurant && (
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-gray-900 text-xl tracking-tight leading-tight truncate">{restaurant.name}</h3>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <MapPin size={13} className="text-gray-500 flex-shrink-0" />
                                            <span className="text-xs text-gray-600 font-semibold truncate">
                                                {typeof restaurant.location === 'string'
                                                    ? restaurant.location
                                                    : (restaurant.area || restaurant.city || "Bangalore")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cart Items List */}
                            <div className="mb-6 max-h-[35vh] md:max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                                <CartList items={cartState.items} />
                            </div>

                            {/* Coupon & Bill Summary */}
                            <div className="space-y-6">
                                <CouponInput />
                                <PriceSummary />
                            </div>

                            {/* Proceed to Pay Button */}
                            {user ? (
                                <Link to={ROUTES.CHECKOUT} state={{ addressId: selectedAddress?._id?.$oid || selectedAddress?._id || selectedAddress?.id }} className="block mt-8">
                                    <div className="space-y-3">
                                        <Button
                                            variant="primary"
                                            disabled={!selectedAddress}
                                            className="w-full bg-green-600 hover:bg-green-700 py-4 text-lg font-bold uppercase tracking-wide rounded-xl shadow-lg shadow-green-200/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                                        >
                                            Proceed to Pay
                                        </Button>
                                        {!selectedAddress && (
                                            <p className="text-xs text-center text-red-600 font-bold uppercase tracking-wider animate-pulse">
                                                Select Delivery Address to Continue
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                <Link to={ROUTES.LOGIN} className="block mt-8">
                                    <Button
                                        variant="primary"
                                        className="w-full bg-gray-900 hover:bg-black py-4 text-base font-bold uppercase tracking-wide rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        Login to Pay
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Security Badge */}
                        <div className="mt-6 flex items-center justify-center gap-3 text-gray-500">
                            <CreditCard size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">100% Secure Checkout</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
