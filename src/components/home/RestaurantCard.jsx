import React from 'react';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

const RestaurantCard = ({ restaurant }) => {
    // Handle both MongoDB formats: _id as string or _id.$oid
    const restaurantId = restaurant._id?.$oid || restaurant._id || restaurant.id;

    return (
        <Link to={`/restaurant/${restaurantId}`} className="block group">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-64">
                {/* Full Image Background */}
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        const cuisine = Array.isArray(restaurant.cuisines) ? restaurant.cuisines[0] : (restaurant.cuisines || 'default');
                        // Use a service or utility for relevant fallback
                        e.target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop`;

                        // Try to find a more relevant image based on cuisine
                        const fallbackMap = {
                            'Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop',
                            'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
                            'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
                            'North Indian': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
                            'South Indian': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
                            'Chinese': 'https://images.unsplash.com/photo-1525755662778-989d052408ec?q=80&w=800&auto=format&fit=crop',
                            'Desserts': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop'
                        };

                        if (fallbackMap[cuisine]) {
                            e.target.src = fallbackMap[cuisine];
                        }
                    }}
                />

                {/* Rating Badge - Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold shrink-0">
                    <Star size={12} fill="currentColor" />
                    <span>{restaurant.rating}</span>
                </div>

                {/* Offers Badge - if present */}
                {(restaurant.offers || restaurant.hasOffer) && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-lg">
                        {restaurant.offers || "OFFER AVAILABLE"}
                    </div>
                )}

                {/* Bottom Text Overlay with Gradient */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4">
                    <h3 className="font-bold text-white text-lg line-clamp-1 mb-1">
                        {restaurant.name}
                    </h3>
                    <p className="text-gray-200 text-sm mb-2 line-clamp-1 font-medium">
                        {Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(', ') : (restaurant.cuisines || '')}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-orange-300" />
                            <span>{restaurant.deliveryTime} MIN</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-orange-300">{formatPrice(restaurant.avgPriceForTwo || 200)} FOR TWO</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
