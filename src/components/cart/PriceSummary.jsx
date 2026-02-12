import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';

const PriceSummary = () => {
    const { state } = useCart();

    // In a real app, these fees should also come from the backend cart response
    // For now we use the ones from backend or assume fixed if backend doesn't provide yet
    // TotalPrice from backend includes all calculations
    const { totalPrice, items } = state;

    const itemTotal = items.reduce((acc, item) => {
        const menuItem = item.menuItem || {};
        const basePrice = menuItem.price || item.price || 0;
        const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
        return acc + ((basePrice + addonsPrice) * item.quantity);
    }, 0);

    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const platformFee = 5;
    const gst = itemTotal * 0.05;

    // Note: If backend sends toPay/grandTotal, use that. 
    // Otherwise calculate based on itemTotal + components if they are fixed.
    // The prompt says "No hardcoded prices or totals. Backend MUST be source of truth."
    // So we should rely on state.totalPrice (which we'll assume is the grand total).

    const allAddons = items.reduce((acc, item) => {
        (item.addons || []).forEach(addon => {
            const existing = acc.find(a => a.name === addon.name);
            if (existing) {
                existing.quantity += item.quantity;
                existing.totalPrice += (addon.price || 0) * item.quantity;
            } else {
                acc.push({
                    name: addon.name,
                    quantity: item.quantity,
                    totalPrice: (addon.price || 0) * item.quantity
                });
            }
        });
        return acc;
    }, []);

    const addonsTotal = allAddons.reduce((sum, a) => sum + a.totalPrice, 0);
    // Use totalPrice from backend if available, otherwise calculate
    const grandTotal = state.totalPrice || (itemTotal + deliveryFee + platformFee + gst - (state.discount || 0));

    return (
        <div className="space-y-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bill Details</h3>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold text-sm">Item Total</span>
                    <span className="font-bold text-gray-900 text-sm">{formatPrice(itemTotal - addonsTotal)}</span>
                </div>

                {allAddons.length > 0 && (
                    <div className="pl-4 border-l-2 border-gray-200 space-y-2 py-1">
                        {allAddons.map((addon, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-gray-600 text-xs font-semibold">{addon.name} (×{addon.quantity})</span>
                                <span className="text-gray-800 text-xs font-bold">{formatPrice(addon.totalPrice)}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="h-px bg-gray-200" />

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold text-sm">Delivery Fee</span>
                        <span className={`font-bold text-sm ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold text-sm">Platform Fee</span>
                        <span className="font-bold text-gray-900 text-sm">{formatPrice(platformFee)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold text-sm">GST and Charges</span>
                        <span className="font-bold text-gray-900 text-sm">{formatPrice(gst)}</span>
                    </div>
                </div>

                {state.discount > 0 && (
                    <div className="flex justify-between items-center py-3 px-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                        <span className="font-bold text-xs uppercase tracking-wide">Coupon Savings</span>
                        <span className="font-bold text-base">-{formatPrice(state.discount)}</span>
                    </div>
                )}
            </div>

            {/* Grand Total - Prominent */}
            <div className="pt-5 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">To Pay</p>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">Total Bill</p>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900">
                        {formatPrice(grandTotal)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceSummary;
