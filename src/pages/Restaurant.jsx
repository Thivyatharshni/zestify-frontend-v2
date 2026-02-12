import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import RestaurantHeader from '../components/restaurant/RestaurantHeader';
import MenuCategory from '../components/restaurant/MenuCategory';
import MenuSearch from '../components/restaurant/MenuSearch';
import StickyCartPreview from '../components/restaurant/StickyCartPreview';
import { restaurantApi } from '../services/restaurantApi';
import { Loader2 } from 'lucide-react';

const Restaurant = () => {
    const { id } = useParams();
    const location = useLocation();
    const [restaurant, setRestaurant] = useState(null);
    const [restaurantId, setRestaurantId] = useState(id); // Store normalized restaurant ID
    const [groupedMenu, setGroupedMenu] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [highlightItemId, setHighlightItemId] = useState(null);
    const [highlightCategory, setHighlightCategory] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null); // null means "All"

    const createSlug = useCallback((value) => {
        return value.toLowerCase().trim().replace(/\s+/g, '-');
    }, []);

    const fetchMenu = useCallback(async (query = '', restaurantId = id, restaurantName = null) => {
        try {
            // Use the provided restaurantId (which might be the real _id from the loaded restaurant) 
            // instead of just the URL param 'id'
            const data = await restaurantApi.getMenu(restaurantId, query);
            // Handle both array and { menu: [...] } wrapper
            let flatMenu = Array.isArray(data) ? data : (data?.menu || data?.items || []);

            // If empty, use mockup fallback
            if (flatMenu.length === 0) {
                // Try matching by ID first
                flatMenu = MENU_ITEMS.filter(item =>
                    String(item.restaurant) === String(restaurantId) ||
                    String(item.restaurant?.$oid) === String(restaurantId)
                );

                // If still empty, try matching by restaurant name 
                if (flatMenu.length === 0 && restaurantName) {
                    const mockRest = RESTAURANTS.find(r => r.name.toLowerCase() === restaurantName.toLowerCase());
                    if (mockRest) {
                        const mockId = mockRest.id || mockRest._id?.$oid;
                        flatMenu = MENU_ITEMS.filter(item => String(item.restaurant) === String(mockId));
                    }
                }
            }

            // Group flat menu by item.category, ensuring IDs are normalized
            const groups = flatMenu.reduce((acc, item) => {
                // Normalize ID - extract string value from $oid or object
                const itemId = item._id?.$oid || item._id?.toString() || item._id || item.id;
                if (itemId && typeof itemId === 'string') {
                    // Replace _id completely with clean string
                    item.id = itemId;
                    delete item._id; // Remove the object reference
                }

                const categoryName = item.category || 'Other';
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(item);
                return acc;
            }, {});

            const sortedGroups = Object.keys(groups).map(name => ({
                categoryName: name,
                items: groups[name]
            }));

            setGroupedMenu(sortedGroups);
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        }
    }, [id]);

    useEffect(() => {
        if (!groupedMenu.length) return;

        const params = new URLSearchParams(location.search);
        const menuItemId = params.get('menuItemId');
        const categoryParam = params.get('category');

        if (menuItemId) {
            const foundCategory = groupedMenu.find(group =>
                group.items.some(item => {
                    const itemId = item._id?.$oid || item._id || item.id;
                    return String(itemId) === String(menuItemId);
                })
            );

            setHighlightItemId(menuItemId);
            setHighlightCategory(foundCategory?.categoryName || null);
            setActiveCategory(foundCategory?.categoryName || null);

            const element = document.getElementById(`menu-item-${menuItemId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        if (categoryParam) {
            const decodedCategory = decodeURIComponent(categoryParam);
            setHighlightItemId(null);
            setHighlightCategory(decodedCategory);
            setActiveCategory(decodedCategory);

            const categorySlug = createSlug(decodedCategory);
            const element = document.getElementById(`menu-category-${categorySlug}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [groupedMenu, location.search, createSlug]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            setLoading(true);
            try {
                const rest = await restaurantApi.getRestaurantById(id);
                setRestaurant(rest);
                // Normalize and store the restaurant ID
                const realId = rest._id?.$oid || rest._id?.toString() || rest._id || rest.id || id;
                setRestaurantId(realId);
                // Use the real _id from the fetched restaurant object to ensure we get the correct menu
                await fetchMenu('', realId, rest.name);
            } catch (error) {
                console.error("Failed to fetch restaurant data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantData();
    }, [id, fetchMenu]);

    // Handle debounced menu search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== undefined) {
                // Pass current restaurant ID and Name (if available) for search
                const currentId = restaurant?._id?.$oid || restaurant?._id?.toString() || restaurant?._id || restaurant?.id || id;
                const currentName = restaurant?.name;
                fetchMenu(searchTerm, currentId, currentName);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchMenu, restaurant, id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
    );

    if (!restaurant) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-gray-500 text-xl font-bold">Restaurant not found</div>
        </div>
    );

    const filteredMenu = activeCategory
        ? groupedMenu.filter(group => group.categoryName === activeCategory)
        : groupedMenu;

    return (
        <div className="min-h-screen bg-white">
            <RestaurantHeader restaurant={restaurant} />

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pt-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Top Horizontal Categories */}
                    <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:h-fit z-30">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 hidden lg:block">Categories</h3>

                            {/* Mobile Horizontal Scroll */}
                            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:-mx-0 lg:px-0 gap-2">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === null
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    All Items
                                </button>
                                {groupedMenu.map((category, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveCategory(category.categoryName)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === category.categoryName
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {category.categoryName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Menu Content Area */}
                    <main className="flex-1 bg-white rounded-t-xl min-h-screen mb-12">
                        <div className="pt-4 text-center text-xs text-gray-500 tracking-widest uppercase mb-4 lg:hidden">M E N U</div>

                        <MenuSearch value={searchTerm} onChange={setSearchTerm} />

                        <div className="h-[1px] bg-gray-200 my-4" />

                        <div className="space-y-4">
                            {filteredMenu.length > 0 ? (
                                filteredMenu.map((category, idx) => {
                                    const categorySlug = createSlug(category.categoryName || 'other');
                                    const isHighlighted = highlightCategory
                                        ? category.categoryName?.toLowerCase() === highlightCategory.toLowerCase()
                                        : false;

                                    return (
                                        <MenuCategory
                                            key={category.categoryName || idx}
                                            category={category}
                                            restaurantId={restaurantId}
                                            anchorId={`menu-category-${categorySlug}`}
                                            defaultOpen={true}
                                            highlight={isHighlighted}
                                            highlightItemId={highlightItemId}
                                        />
                                    );
                                })
                            ) : (
                                <div className="py-20 text-center text-gray-400">
                                    No menu items found
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <StickyCartPreview />
        </div>
    );
};

export default Restaurant;
