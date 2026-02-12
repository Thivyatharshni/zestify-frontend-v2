import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { restaurantApi } from '../../services/restaurantApi';
import { cmsApi } from '../../services/dashboard/cmsApi';
import { CATEGORIES } from '../../mocks/categories.mock';
import { getCategoryFallbackImage } from '../../utils/categoryUtils';

const CategorySlider = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cardSpacing, setCardSpacing] = useState(200); // Default desktop spacing

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCardSpacing(120); // Mobile spacing
            } else if (window.innerWidth < 1024) {
                setCardSpacing(160); // Tablet spacing
            } else {
                setCardSpacing(200); // Desktop spacing
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchCategoriesData = async () => {
            try {
                setLoading(true);
                // 1. Try CMS first
                const cmsResponse = await cmsApi.getCategories();
                if (cmsResponse.data.success && cmsResponse.data.data && cmsResponse.data.data.length > 0) {
                    setCategories(cmsResponse.data.data);
                    return;
                }

                // 2. Fallback to API + Mocks (Original logic)
                const data = await restaurantApi.getCategories();
                const backendCats = Array.isArray(data) ? data : [];
                const merged = [...backendCats];

                CATEGORIES.forEach(mockCat => {
                    if (!merged.find(c => c.name.toLowerCase() === mockCat.name.toLowerCase())) {
                        merged.push(mockCat);
                    }
                });

                setCategories(merged);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategories(CATEGORIES);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoriesData();
    }, []);

    const handleNext = () => {
        if (categories.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % categories.length);
    };

    const handlePrev = () => {
        if (categories.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    };

    const createSlug = (name) => {
        return name.toLowerCase().replace(/\s+/g, '-');
    };

    const handleCategoryClick = (categoryName) => {
        const slug = createSlug(categoryName);
        navigate(`/category/${slug}`);
    };

    useEffect(() => {
        if (isPaused || categories.length === 0) return;

        const interval = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, currentIndex, categories]);

    if (loading) return (
        <div className="py-20 text-center text-gray-400">Loading categories...</div>
    );

    if (categories.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="relative bg-white shadow-[0_32px_128px_-32px_rgba(0,0,0,0.12)] border border-gray-50 overflow-hidden py-8 md:py-10 px-6 rounded-[3.5rem]">

                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-orange-50/40 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_var(--tw-gradient-stops))] from-violet-50/30 via-transparent to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-12 text-center">
                            <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                                What's on your <span className="text-orange-500">mind?</span>
                            </h2>
                        </div>

                        <div className="relative w-full max-w-[1440px] mx-auto h-[200px] flex items-center justify-center">
                            {/* Navigation Arrows */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-5 rounded-full bg-white/80 backdrop-blur-md shadow-2xl border border-gray-100 text-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 active:scale-90 group"
                            >
                                <ChevronLeft size={40} className="group-hover:-translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={handleNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-5 rounded-full bg-white/80 backdrop-blur-md shadow-2xl border border-gray-100 text-gray-800 hover:bg-orange-500 hover:text-white transition-all duration-300 active:scale-90 group"
                            >
                                <ChevronRight size={40} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Rotating Items Container */}
                            <div className="relative w-full h-full flex items-center justify-center perspective-2000">
                                <div className="relative w-full h-full preserve-3d">
                                    {categories.map((cat, idx) => {
                                        let relativeIndex = idx - currentIndex;
                                        if (relativeIndex < -categories.length / 2) relativeIndex += categories.length;
                                        if (relativeIndex > categories.length / 2) relativeIndex -= categories.length;

                                        const isVisible = Math.abs(relativeIndex) <= 3;
                                        const isActive = Math.abs(relativeIndex) === 0;

                                        const xOffset = relativeIndex * cardSpacing;
                                        const zOffset = Math.abs(relativeIndex) * -250;
                                        const rotation = relativeIndex * 15;
                                        const opacity = isVisible ? (Math.abs(relativeIndex) <= 2 ? 1 - Math.abs(relativeIndex) * 0.3 : 0.2) : 0;
                                        const scale = isVisible ? (Math.abs(relativeIndex) <= 2 ? 1 - Math.abs(relativeIndex) * 0.2 : 0.5) : 0;

                                        const catId = cat._id?.$oid || cat.id || cat.name || idx;

                                        return (
                                            <div
                                                key={catId}
                                                className="absolute left-1/2 top-1/2 transition-all duration-700 ease-in-out cursor-pointer"
                                                style={{
                                                    transform: `translate(-50%, -50%) translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotation}deg) scale(${scale})`,
                                                    opacity: opacity,
                                                    zIndex: 10 - Math.abs(relativeIndex),
                                                    pointerEvents: isVisible ? 'auto' : 'none',
                                                    width: '320px'
                                                }}
                                                onClick={() => handleCategoryClick(cat.name)}
                                            >
                                                <div
                                                    className="flex flex-col items-center group"
                                                    onMouseEnter={() => setIsPaused(true)}
                                                    onMouseLeave={() => setIsPaused(false)}
                                                >
                                                    <div className={`
                                                        rounded-full overflow-hidden shadow-2xl transition-all duration-700 w-32 h-32 md:w-44 md:h-44
                                                        ${isActive ? 'ring-8 ring-orange-500/30' : 'ring-4 ring-transparent group-hover:ring-orange-500/50'}
                                                        ${isActive ? 'shadow-[0_20px_50px_rgba(249,115,22,0.4)]' : ''}
                                                    `}>
                                                        <img
                                                            src={cat.image || getCategoryFallbackImage(cat.name)}
                                                            alt={cat.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                if (e.target.src !== getCategoryFallbackImage('default')) {
                                                                    e.target.src = getCategoryFallbackImage('default');
                                                                }
                                                            }}
                                                        />
                                                    </div>

                                                    <div className={`
                                                        mt-4 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] px-8 py-3 rounded-full border-2 transform transition-all duration-500
                                                        ${isActive ? 'bg-orange-500 border-orange-400 shadow-orange-500/30 scale-105' : 'bg-white border-gray-100/50 group-hover:scale-105'}
                                                    `}>
                                                        <span className={`
                                                            text-lg md:text-xl font-black tracking-tight 
                                                            ${isActive ? 'text-white' : 'text-gray-900'}
                                                        `}>
                                                            {cat.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .perspective-2000 {
                    perspective: 2000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
            `}</style>
        </div>
    );
};

export default CategorySlider;
