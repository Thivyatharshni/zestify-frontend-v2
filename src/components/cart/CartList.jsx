import React from 'react';
import CartItem from './CartItem';

const CartList = ({ items }) => {
    return (
        <div className="space-y-0">
            {items.map((item) => {
                // Normalize the key for React rendering
                const key = item.tempId || item.menuItem?.$oid || item.menuItem?._id || item.menuItem?.toString() || item.menuItem || item.id;
                return <CartItem key={key} item={item} />;
            })}
        </div>
    );
};

export default CartList;
