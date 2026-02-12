import React from 'react';
import { Star, Clock, MapPin, Search } from 'lucide-react';

const RestaurantHeader = ({ restaurant }) => {
    if (!restaurant) return null;

    return (
        <div
            className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
            style={{ backgroundImage: `url(${restaurant.heroImageUrl || restaurant.image || 'https://res.cloudinary.com/dnpk9egyk/image/upload/v1770700974/zestify/images/restaurant-hero-light.jpg'})` }}
        >
            {/* Premium Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

            <div className="relative z-10 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">{restaurant.name}</h1>

                            <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-xl shadow-xl border border-white/20 w-fit">
                                <Star size={18} fill="currentColor" />
                                <span className="font-black text-xl">{restaurant.rating}</span>
                                <span className="text-white/90 text-[10px] font-black ml-1 uppercase tracking-[0.2em]">| 1K+ Ratings</span>
                            </div>
                        </div>

                        <p className="text-gray-200 text-xl font-bold -mt-2 drop-shadow-md">
                            {Array.isArray(restaurant.cuisines) ? restaurant.cuisines.join(", ") : (restaurant.cuisines || "")}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-white font-black uppercase tracking-widest mt-2">
                            {/* Hoverable Location Address */}
                            <div className="group flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:bg-white/20 cursor-pointer max-w-fit overflow-hidden">
                                <MapPin size={18} className="text-orange-400 flex-shrink-0" />
                                <span className="max-w-0 opacity-0 group-hover:max-w-[400px] group-hover:opacity-100 transition-all duration-500 ease-in-out truncate whitespace-nowrap">
                                    {typeof restaurant.location === 'string' ? restaurant.location : (restaurant.location?.address || restaurant.area || restaurant.city || "Bangalore")}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl">
                                <Clock size={18} className="text-orange-400" />
                                {restaurant.deliveryTime} (EST.)
                            </div>
                        </div>
                    </div>
                </div>

                {restaurant.offers && (
                    <div className="mt-10 inline-flex items-center gap-3 px-8 py-3 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-2xl shadow-violet-500/30 border border-white/30 text-xs font-black uppercase tracking-widest transform hover:-translate-y-1 transition-all">
                        <span className="bg-white text-gray-900 rounded-full p-1 w-6 h-6 flex items-center justify-center text-[10px] font-black italic">%</span>
                        {restaurant.offers}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantHeader;
