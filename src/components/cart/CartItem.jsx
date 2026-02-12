import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';

const CartItem = ({ item }) => {
    const { updateQuantity, removeItem } = useCart();

    // Normalize the item ID for API calls
    const getItemId = (item) => {
        return item.menuItem?.$oid || item.menuItem?._id || item.menuItem?.toString() || item.menuItem || item.id;
    };

    const itemId = getItemId(item);

    const handleUpdateQuantity = async (newQty) => {
        try {
            if (newQty === 0) {
                await removeItem(itemId);
            } else {
                await updateQuantity(itemId, newQty);
            }
        } catch (error) {
            console.error("Cart update failed:", error);
        }
    };

    const menuItem = item.menuItem || {};
    const name = menuItem.name || item.name || 'Unknown Item';
    const isVeg = menuItem.isVeg !== undefined ? menuItem.isVeg : item.isVeg;
    const basePrice = menuItem.price || item.price || 0;
    const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
    const unitPriceWithAddons = basePrice + addonsPrice;

    return (
        <div className="group py-4 px-2 border-b border-gray-100 last:border-0 transition-all duration-200 hover:bg-gray-50/50 rounded-lg">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-1 w-3 h-3 border flex items-center justify-center rounded-sm flex-shrink-0 ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-sm md:text-base font-bold text-gray-900 truncate">{name}</h4>
                        <p className="text-xs text-gray-600 font-semibold mt-1">
                            {formatPrice(unitPriceWithAddons)} per unit
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                    <div className="flex items-center h-8 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:border-green-500 transition-colors">
                        <button
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors font-bold text-base"
                            onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        >
                            -
                        </button>
                        <span className="w-8 h-full flex items-center justify-center text-gray-900 font-bold text-sm bg-gray-50">{item.quantity}</span>
                        <button
                            className="w-8 h-full flex items-center justify-center text-gray-900 hover:text-green-600 hover:bg-green-50 transition-colors font-bold text-lg"
                            onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="text-sm md:text-base font-bold text-gray-900 min-w-[70px] text-right">
                        {formatPrice(unitPriceWithAddons * item.quantity)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
