import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import RestaurantCard from '../components/home/RestaurantCard';
import { restaurantApi } from '../services/restaurantApi';

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [restaurantResults, setRestaurantResults] = useState([]);
    const [menuResults, setMenuResults] = useState([]);
    const [categoryResults, setCategoryResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initialize search term from URL
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('q') || '';
        setSearchTerm(query);
    }, [location.search]);

    const performSearch = useCallback(async (query) => {
        if (!query.trim()) {
            setRestaurantResults([]);
            setMenuResults([]);
            setCategoryResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const results = await restaurantApi.searchRestaurants(query);

            const restaurants = results
                .filter(result => result.type === 'restaurant')
                .map(result => result.data)
                .filter(restaurant => restaurant?._id || restaurant?.id);

            const menuItems = results
                .filter(result => result.type === 'menu')
                .map(result => ({
                    ...result.data,
                    restaurantId: result.data.restaurantId || result.data.restaurant?._id || result.data.restaurant
                }))
                .filter(item => item?.restaurantId);

            const categories = results
                .filter(result => result.type === 'category')
                .map(result => result.data)
                .filter(category => category?.name);

            setRestaurantResults(restaurants);
            setMenuResults(menuItems);
            setCategoryResults(categories);

        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const query = new URLSearchParams(location.search).get('q') || '';
        const timer = setTimeout(() => {
            performSearch(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [location.search, performSearch]);

    const handleSearchInput = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        // Update URL to trigger the search effect
        const params = new URLSearchParams(location.search);
        if (val.trim()) {
            params.set('q', val);
        } else {
            params.delete('q');
        }
        navigate({ search: params.toString() }, { replace: true });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            performSearch(searchTerm);
        }
    };

    const query = new URLSearchParams(location.search).get('q') || '';

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-[80px] z-30 bg-white px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-100">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for restaurants and food..."
                        value={searchTerm}
                        onChange={handleSearchInput}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-lg"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {loading ? <Loader2 size={24} className="animate-spin text-blue-600" /> : <SearchIcon size={24} />}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {query && !loading && (
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Results for "{query}"
                        <span className="ml-2 text-sm font-normal text-gray-500">({categoryResults.length + restaurantResults.length + menuResults.length})</span>
                    </h2>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : (categoryResults.length > 0 || restaurantResults.length > 0 || menuResults.length > 0) ? (
                    <div className="space-y-12">
                        {categoryResults.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Categories</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {categoryResults.map((category) => (
                                        <div
                                            key={category._id || category.name}
                                            onClick={() => navigate(`/category/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`)}
                                            className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer group"
                                        >
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 group-hover:scale-110 transition-transform">
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-blue-600 transition-colors">
                                                {category.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {restaurantResults.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Restaurants</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {restaurantResults.map((restaurant) => {
                                        const restaurantId = restaurant._id?.$oid || restaurant._id || restaurant.id;
                                        return (
                                            <Link key={restaurantId} to={`/restaurant/${restaurantId}`}>
                                                <RestaurantCard restaurant={restaurant} />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {menuResults.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Dishes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {menuResults.map((item) => {
                                        const itemId = item._id?.$oid || item._id || item.id;
                                        const restaurantId = item.restaurantId;
                                        return (
                                            <button
                                                key={itemId}
                                                type="button"
                                                onClick={() => navigate(`/restaurant/${restaurantId}?menuItemId=${encodeURIComponent(itemId)}`)}
                                                className="text-left bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-600 transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Menu Item</p>
                                                        <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {item.category ? `${item.category} · ` : ''}{item.restaurantName || 'Restaurant'}
                                                        </p>
                                                        {item.description && (
                                                            <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                                                        )}
                                                    </div>
                                                    {item.imageUrl || item.image ? (
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                                                            <img
                                                                src={item.imageUrl || item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                ) : query ? (
                    <div className="text-center py-24">
                        <div className="text-gray-300 mb-4 flex justify-center">
                            <SearchIcon size={64} />
                        </div>
                        <p className="text-xl text-gray-500">No results found matching "{query}"</p>
                        <p className="text-gray-400 mt-2">Try searching for something else</p>
                    </div>
                ) : (
                    <div className="text-center py-24 text-gray-400">
                        Start typing to search for your favorite food...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
