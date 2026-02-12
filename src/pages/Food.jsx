import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodApi } from '../services/foodApi';
import { restaurantApi } from '../services/restaurantApi';
import { useLocation } from '../context/LocationContext';
import { Star, Clock, MapPin, Flame, TrendingUp, Sparkles } from 'lucide-react';

const Food = () => {
    const navigate = useNavigate();
    const { location: userLocation, setRestaurantCount } = useLocation();
    const [restaurants, setRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // Highly specific, verified category images from Unsplash
    const CATEGORY_IMAGES = {
        'Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop&q=80',
        'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80',
        'Chinese': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop&q=80',
        'Desserts': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&q=80',
        'North Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&q=80',
        'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&q=80',
        'South Indian': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=400&fit=crop&q=80',
        'Pasta': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop&q=80',
        'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&q=80',
        'Sandwich': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=400&fit=crop&q=80',
        'Sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop&q=80',
        'Tacos': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop&q=80',
        'Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop&q=80',
        'Drinks': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&q=80',
        'Breakfast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=400&fit=crop&q=80'
    };

    const PLACEHOLDER_IMAGES = {
        category: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80',
        vegFood: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&q=80',
        nonVegFood: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop&q=80',
        restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80'
    };

    useEffect(() => {
        if (userLocation || userLocation === null) {
            fetchData();
        }
    }, [userLocation]);

    const fetchData = async () => {
        setLoading(true);
        console.log("FETCH DATA LOCATION:", userLocation);
        try {
            const { lat, lng } = userLocation?.coordinates || {};

            let restaurantsData = [];

            // Strict branch: If coordinates exist, fetch nearby. Else fetch global.
            if (lat && lng) {
                restaurantsData = await restaurantApi.getNearbyRestaurants(lat, lng);
            } else {
                restaurantsData = await foodApi.getRestaurants();
            }

            const [categoriesData, itemsData] = await Promise.all([
                foodApi.getCategories(),
                foodApi.getFoodItems({ limit: 20 })
            ]);

            setRestaurants(restaurantsData);
            setCategories(categoriesData);
            setFoodItems(itemsData);
            setRestaurantCount(restaurantsData.length);
        } catch (error) {
            console.error('Error fetching food data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        const items = await foodApi.getFoodItems({ category: category.name });
        setFoodItems(items);
    };

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/restaurant/${restaurantId}`);
    };

    const handleFoodItemClick = (item) => {
        navigate(`/restaurant/${item.restaurant._id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                    <p className="mt-4 text-orange-400 text-lg font-semibold">Loading delicious options...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-16">
            {/* Hero Section - Dark Premium */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b border-orange-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl shadow-2xl shadow-orange-500/30">
                            <Flame className="text-white" size={40} />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                                Discover Your Next Meal
                            </h1>
                            <p className="text-xl text-gray-400">
                                Explore tempting dishes, popular restaurants, and trending categories
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                {/* Categories Section - Image-First Design */}
                {categories.length > 0 ? (
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-orange-500" size={28} />
                                <h2 className="text-3xl font-bold text-white">Browse by Category</h2>
                            </div>
                            {selectedCategory && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        fetchData();
                                    }}
                                    className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg transition-all duration-200"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {categories.map((category) => {
                                // Prefer database image, then Unsplash category map, then generic
                                const imageUrl = category.image || CATEGORY_IMAGES[category.name] || PLACEHOLDER_IMAGES.category;

                                return (
                                    <button
                                        key={category._id}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer ${selectedCategory?._id === category._id
                                            ? 'ring-4 ring-orange-500 shadow-2xl shadow-orange-500/50'
                                            : 'hover:shadow-2xl hover:shadow-orange-500/30'
                                            }`}
                                    >
                                        <div className="aspect-square relative bg-gradient-to-br from-orange-900/20 to-red-900/20">
                                            <img
                                                src={imageUrl}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.src = PLACEHOLDER_IMAGES.category;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="text-white font-bold text-center text-sm sm:text-base drop-shadow-2xl">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ) : (
                    <section className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-12 text-center border border-orange-900/20">
                        <Sparkles className="mx-auto text-orange-500/50 mb-4" size={64} />
                        <h3 className="text-2xl font-bold text-white mb-2">No Categories Available</h3>
                        <p className="text-gray-400">Categories will appear here once they're added to the system.</p>
                    </section>
                )}

                {/* Food Items Section - Instagram-Style Feed */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="text-orange-500" size={28} />
                        <h2 className="text-3xl font-bold text-white">
                            {selectedCategory ? `${selectedCategory.name}` : 'Popular Dishes'}
                        </h2>
                    </div>
                    {foodItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {foodItems.map((item) => {
                                // Trust backend image first.
                                // Fallback to generic only if backend image is missing/broken.
                                const placeholderImage = item.isVeg ? PLACEHOLDER_IMAGES.vegFood : PLACEHOLDER_IMAGES.nonVegFood;
                                const imageUrl = item.imageUrl || placeholderImage;

                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => handleFoodItemClick(item)}
                                        className="group cursor-pointer bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2"
                                    >
                                        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-orange-900/10 to-red-900/10">
                                            <img
                                                src={imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    // On error, fallback to generic
                                                    e.target.src = placeholderImage;
                                                }}
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm ${item.isVeg
                                                    ? 'bg-green-500/90 text-white'
                                                    : 'bg-red-500/90 text-white'
                                                    }`}>
                                                    {item.isVeg ? '🌱 VEG' : '🍖 NON-VEG'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-orange-400 transition-colors">
                                                {item.name}
                                            </h3>

                                            {item.description && (
                                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-2xl font-black text-orange-500">
                                                    ₹{item.price}
                                                </span>
                                            </div>

                                            {item.restaurant && (
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin size={12} />
                                                        <span className="line-clamp-1">{item.restaurant.name}</span>
                                                    </div>
                                                    {item.restaurant.rating && (
                                                        <div className="flex items-center gap-1 text-orange-400">
                                                            <Star size={12} fill="currentColor" />
                                                            <span className="text-xs font-semibold">{item.restaurant.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-12 text-center border border-orange-900/20">
                            <TrendingUp className="mx-auto text-orange-500/50 mb-4" size={64} />
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {selectedCategory ? `No ${selectedCategory.name} items found` : 'No dishes available yet'}
                            </h3>
                            <p className="text-gray-400">
                                {selectedCategory
                                    ? 'Try selecting a different category or check back later.'
                                    : 'Delicious food items will appear here once they\'re added.'}
                            </p>
                        </div>
                    )}
                </section>

                {/* Restaurants Section - Premium Cards */}
                {restaurants.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <Flame className="text-orange-500" size={28} />
                            <h2 className="text-3xl font-bold text-white">Featured Restaurants</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.slice(0, 12).map((restaurant) => {
                                const imageUrl = restaurant.image || getVariedImage(restaurant.name || restaurant._id, PLACEHOLDER_IMAGES.restaurant);

                                return (
                                    <div
                                        key={restaurant._id}
                                        onClick={() => handleRestaurantClick(restaurant._id)}
                                        className="group cursor-pointer bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2"
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-orange-900/10 to-red-900/10">
                                            <img
                                                src={imageUrl}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = getVariedImage(restaurant._id, PLACEHOLDER_IMAGES.restaurant);
                                                }}
                                            />

                                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                {restaurant.isPureVeg && (
                                                    <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl">
                                                        🌱 PURE VEG
                                                    </div>
                                                )}
                                                {restaurant.hasOffer && (
                                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl">
                                                        🎉 OFFERS
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                                                {restaurant.name}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Star size={16} className="text-orange-500" fill="currentColor" />
                                                    <span className="font-semibold text-white">{restaurant.rating || 'New'}</span>
                                                </div>
                                                {restaurant.deliveryTime && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={16} />
                                                        <span>{restaurant.deliveryTime} mins</span>
                                                    </div>
                                                )}
                                            </div>

                                            {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                                                <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                                                    {restaurant.cuisines.join(', ')}
                                                </p>
                                            )}

                                            {restaurant.avgPriceForTwo && (
                                                <p className="text-sm text-orange-400 font-semibold">
                                                    ₹{restaurant.avgPriceForTwo} for two
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Food;
