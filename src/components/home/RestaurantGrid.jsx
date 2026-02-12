import React, { useEffect, useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { restaurantApi } from '../../services/restaurantApi';
import { useLocation } from '../../context/LocationContext';
import { RESTAURANTS } from '../../mocks/restaurants.mock';

const RestaurantGrid = ({ activeFilters }) => {
    const { location: userLocation } = useLocation();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const { lat, lng } = userLocation?.coordinates || {};
                let data = [];

                if (lat && lng) {
                    console.log("📍 Fetching nearby restaurants for:", lat, lng);
                    data = await restaurantApi.getNearbyRestaurants(lat, lng);
                } else {
                    console.log("🌎 Fetching global restaurants with filters:", activeFilters);
                    // Map active filters to backend-specific query params
                    let params = {};

                    activeFilters.forEach(filter => {
                        switch (filter) {
                            case "Fast Delivery":
                                params.sort = "deliveryTime";
                                break;
                            case "Rating 4.0+":
                                params.minRating = 4;
                                break;
                            case "Pure Veg":
                                params.isPureVeg = true;
                                break;
                            case "Offers":
                                params.hasOffer = true;
                                break;
                            case "Rs. 300-600":
                                params.minPrice = 300;
                                params.maxPrice = 600;
                                break;
                            case "Less than Rs. 300":
                                params.maxPrice = 300;
                                break;
                            default:
                                break;
                        }
                    });

                    data = await restaurantApi.getRestaurants(params);
                }

                const backendItems = Array.isArray(data) ? data : (data?.restaurants || []);
                setRestaurants(backendItems);
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
                setRestaurants([]);
            } finally {
                setLoading(false);
            }
        };

        if (userLocation || userLocation === null) {
            fetchRestaurants();
        }
    }, [activeFilters, userLocation]);

    if (loading) return <div
        className="grid gap-6 py-8 px-4 sm:px-0"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
    >
        {[...Array(10)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl"></div>
        ))}
    </div>;

    return (
        <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 px-4 sm:px-0">All Restaurants</h2>

            {restaurants.length > 0 ? (
                <div
                    className="grid gap-6 px-4 sm:px-0"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        maxWidth: '100%'
                    }}
                >
                    {restaurants.map((restaurant, index) => {
                        const restaurantId = restaurant._id?.$oid || restaurant.id || `rest-${index}`;
                        return <RestaurantCard key={restaurantId} restaurant={restaurant} />;
                    })}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    No restaurants found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default RestaurantGrid;
