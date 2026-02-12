import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/cartApi';
import { MENU_ITEMS } from '../mocks/menu.mock';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            const payload = action.payload || {};
            const rawRestId = payload.restaurantId || payload.restaurant;
            const normalizedRestId = rawRestId?.$oid || rawRestId?.toString() || rawRestId || null;

            // Normalize items to ensure proper structure while preserving populated data
            const normalizedItems = (payload.items || []).map(item => {
                const menuItemData = item.menuItem;
                const isPopulated = menuItemData && typeof menuItemData === 'object' && !menuItemData.$oid;

                return {
                    ...item,
                    // If populated, keep the object. Otherwise normalized to string ID.
                    menuItem: isPopulated ? menuItemData : (menuItemData?.$oid || menuItemData?.toString() || menuItemData || item.id),
                    id: isPopulated ? (menuItemData._id || menuItemData.id) : (menuItemData?.$oid || menuItemData?.toString() || menuItemData || item.id)
                };
            });

            console.log('🔄 CartContext - Normalized Items:', normalizedItems.map(i => ({
                id: i.id,
                isPopulated: typeof i.menuItem === 'object'
            })));

            // Calculate total price locally if not provided by backend
            const calculatedTotal = normalizedItems.reduce((acc, item) => {
                const menuItem = item.menuItem || {};
                const basePrice = menuItem.price || item.price || 0;
                const addonsPrice = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
                return acc + ((basePrice + addonsPrice) * item.quantity);
            }, 0);

            return {
                ...state,
                items: normalizedItems,
                totalPrice: payload.totalPrice || calculatedTotal,
                totalItems: payload.totalItems || normalizedItems.reduce((sum, i) => sum + i.quantity, 0),
                restaurantId: normalizedRestId,
                couponCode: payload.couponCode || null,
                discount: payload.discount || 0,
                loading: false
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'APPLY_COUPON':
            return {
                ...state,
                couponCode: action.payload.couponCode,
                discount: action.payload.discount
            };
        case 'REMOVE_COUPON':
            return {
                ...state,
                couponCode: null,
                discount: 0
            };
        case 'CLEAR_CART':
            return { items: [], totalPrice: 0, totalItems: 0, restaurantId: null, couponCode: null, discount: 0, loading: false };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        totalPrice: 0,
        totalItems: 0,
        restaurantId: null,
        couponCode: null,
        discount: 0,
        loading: true
    });
    const { user } = useAuth();

    const refreshCart = useCallback(async () => {
        if (!user) {
            dispatch({ type: 'CLEAR_CART' });
            return;
        }
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const cartData = await cartApi.getCart();
            dispatch({ type: 'SET_CART', payload: cartData });
        } catch (error) {
            console.error("Failed to refresh cart:", error);
            // Set empty cart on error to prevent crashes
            dispatch({ type: 'SET_CART', payload: { items: [], totalPrice: 0, totalItems: 0 } });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            refreshCart();
        } else {
            dispatch({ type: 'CLEAR_CART' });
        }
    }, [user, refreshCart]);

    const addItem = async (restaurantId, menuItemId, quantity, addons = []) => {
        // Ensure restaurantId is a string if it's an object with $oid
        const normalizedRestaurantId = restaurantId?.$oid || restaurantId?.toString() || restaurantId;

        console.log('🛒 CartContext.addItem called:', {
            originalRestaurantId: restaurantId,
            normalizedRestaurantId,
            menuItemId,
            quantity,
            addons,
            currentCartState: {
                restaurantId: state.restaurantId,
                itemCount: state.items.length
            }
        });

        try {
            // Check restaurant lock
            if (state.restaurantId && state.restaurantId !== normalizedRestaurantId && state.items.length > 0) {
                console.log('⚠️ Different restaurant detected - prompting user');
                if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
                    console.log('❌ User cancelled cart clear');
                    return;
                }
                console.log('✅ User confirmed cart clear');
                try { await cartApi.clearCart(); } catch (e) { }
                dispatch({ type: 'CLEAR_CART' });
            }

            console.log('📡 Calling cartApi.addToCart with:', { normalizedRestaurantId, menuItemId, quantity, addons });
            const updatedCart = await cartApi.addToCart(normalizedRestaurantId, menuItemId, quantity, addons);
            console.log('✅ Cart updated successfully:', updatedCart);
            dispatch({ type: 'SET_CART', payload: updatedCart });
            return updatedCart;
        } catch (error) {
            console.error("❌ Add item failed in CartContext:", error);
            console.error("❌ Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    };

    const updateQuantity = async (menuItemId, quantity) => {
        try {
            const updatedCart = await cartApi.updateCartItem(menuItemId, quantity);
            dispatch({ type: 'SET_CART', payload: updatedCart });
            return updatedCart;
        } catch (error) {
            console.error("Update quantity failed:", error);
            throw error;
        }
    };

    const removeItem = async (menuItemId) => {
        try {
            const updatedCart = await cartApi.removeFromCart(menuItemId);
            dispatch({ type: 'SET_CART', payload: updatedCart });
            return updatedCart;
        } catch (error) {
            console.error("Remove item failed:", error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await cartApi.clearCart();
            dispatch({ type: 'CLEAR_CART' });
        } catch (error) {
            console.error("Clear cart failed:", error);
            throw error;
        }
    };

    const applyCoupon = ({ code, discount }) => {
        dispatch({
            type: 'APPLY_COUPON',
            payload: {
                couponCode: code,
                discount
            }
        });
    };

    const removeCoupon = () => {
        dispatch({ type: 'REMOVE_COUPON' });
        // TODO: Call backend to remove coupon from cart
    };

    return (
        <CartContext.Provider value={{ state, dispatch, refreshCart, addItem, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
