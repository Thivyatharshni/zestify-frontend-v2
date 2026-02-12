import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ROUTES } from '../../routes/RouteConstants';
import { formatPrice } from '../../utils/formatPrice';
import { ShoppingBag } from 'lucide-react';

const StickyCartPreview = () => {
    const { state } = useCart();
    const cartItemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = state.totalPrice;

    if (cartItemCount === 0) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
            <Link to={ROUTES.CART}>
                <div className="max-w-4xl mx-auto bg-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:bg-blue-700 transition-colors">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm uppercase tracking-wide">
                            {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} | {formatPrice(totalPrice)}
                        </span>
                        <span className="text-[10px] opacity-80 font-medium">Extra charges may apply</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
                        View Cart <ShoppingBag size={18} />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default StickyCartPreview;
