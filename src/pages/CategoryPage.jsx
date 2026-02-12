import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '../services/restaurantApi';
import FoodItemCard from '../components/restaurant/FoodItemCard';
import { MENU_ITEMS } from '../mocks/menu.mock';
import { Loader2 } from 'lucide-react';

/**
 * CategoryPage
 * Route: /category/:categorySlug
 *
 * Backend-ready:
 * GET /api/menu-items?category={categoryName}
 */

const CategoryPage = () => {
    const { categorySlug } = useParams();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurant, setRestaurant] = useState(null);

    const isRestaurant = categorySlug.startsWith('restaurant-');
    const identifier = isRestaurant ? categorySlug.replace('restaurant-', '') : categorySlug;

    // Convert slug → readable name
    const displayName = isRestaurant ? (restaurant?.name || 'Restaurant') : identifier
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                if (isRestaurant) {
                    // Fetch restaurant details and menu
                    const [restaurantData, menuData] = await Promise.all([
                        restaurantApi.getRestaurantById(identifier),
                        restaurantApi.getMenuItemsByRestaurant(identifier)
                    ]);

                    setRestaurant(restaurantData);
                    setMenuItems(Array.isArray(menuData) ? menuData : []);
                } else {
                    // Category flow
                    const data = await restaurantApi.getMenuItemsByCategory(displayName);

                    if (Array.isArray(data) && data.length > 0) {
                        setMenuItems(data);
                    } else {
                        // Fallback to mock data
                        const filteredMock = MENU_ITEMS.filter(item =>
                            item.category?.toLowerCase() === displayName.toLowerCase()
                        );
                        setMenuItems(filteredMock);
                    }
                }
            } catch (err) {
                console.error(`Failed to fetch ${isRestaurant ? 'restaurant' : 'category'} menu items:`, err);

                if (isRestaurant) {
                    // For restaurant, try fallback to mock
                    const filteredMock = MENU_ITEMS.filter(item =>
                        item.restaurant === identifier
                    );
                    setMenuItems(filteredMock);
                } else {
                    // Category fallback
                    const filteredMock = MENU_ITEMS.filter(item =>
                        item.category?.toLowerCase() === displayName.toLowerCase()
                    );
                    setMenuItems(filteredMock);
                }

                if (menuItems.length === 0) {
                    setError(`No menu items found for this ${isRestaurant ? 'restaurant' : 'category'}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categorySlug, identifier, displayName, isRestaurant]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        {displayName}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Delicious {displayName} items{isRestaurant ? '' : ' from top restaurants'}
                    </p>
                </div>

                {error && menuItems.length === 0 && (
                    <div className="text-center py-16 text-gray-500 font-medium">
                        {error}
                    </div>
                )}

                {menuItems.length > 0 ? (
                    <div className="space-y-4">
                        {menuItems.map((item, index) => {
                            const itemId = item._id?.$oid || item._id || item.id || `category-item-${index}`;
                            return (
                                <FoodItemCard
                                    key={itemId}
                                    item={item}
                                    restaurantId={item.restaurantId || item.restaurant?._id || item.restaurant?.id}
                                />
                            );
                        })}
                    </div>
                ) : (
                    !error && (
                        <div className="text-center py-16 text-gray-500 font-medium">
                            No menu items available{isRestaurant ? ' for this restaurant' : ' in this category'}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
