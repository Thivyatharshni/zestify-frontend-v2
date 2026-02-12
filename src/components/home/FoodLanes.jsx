import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { cmsApi } from '../../services/dashboard/cmsApi';

import { DEFAULT_LANES } from '../../mocks/lanes.mock';

const FoodLanes = () => {
    const [lanes, setLanes] = useState(DEFAULT_LANES);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchCmsLanes = async () => {
            try {
                setLoading(true);
                const response = await cmsApi.getLanes();
                if (response.data.success && response.data.data && response.data.data.length > 0) {
                    setLanes(response.data.data.map(lane => ({
                        ...lane,
                        id: lane._id,
                        gradient: lane.gradient || "from-slate-950/90 via-slate-900/40 to-transparent",
                        accent: lane.accent || "text-blue-400"
                    })));
                }
            } catch (error) {
                console.error("CMS Lanes fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchCmsLanes();
    }, []);
    const scrollRef = useRef(null);
    const isMovingProgrammatically = useRef(false);

    // Continuous auto-scroll interval logic
    useEffect(() => {
        if (lanes.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % lanes.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [lanes]);

    // Programmatically scroll the container when currentIndex changes
    useEffect(() => {
        if (scrollRef.current && !isMovingProgrammatically.current) {
            isMovingProgrammatically.current = true;
            const container = scrollRef.current;
            const scrollAmount = container.clientWidth * currentIndex;

            container.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });

            // Reset the flag after the smooth scroll animation completes (~500ms)
            setTimeout(() => {
                isMovingProgrammatically.current = false;
            }, 600);
        }
    }, [currentIndex]);

    // Synchronize Index with Manual Scroll
    const handleManualScroll = () => {
        if (isMovingProgrammatically.current) return;

        if (scrollRef.current) {
            const container = scrollRef.current;
            const newIndex = Math.round(container.scrollLeft / container.clientWidth);

            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        }
    };

    if (lanes.length === 0) return null;

    return (
        <div
            className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black overflow-hidden select-none"
        >
            {/* Horizontal Lane Container */}
            <div
                ref={scrollRef}
                onScroll={handleManualScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar cursor-grab active:cursor-grabbing"
            >
                {lanes.map((lane, index) => {
                    const isActive = index === currentIndex;

                    return (
                        <div
                            key={lane.id}
                            className={`relative flex-shrink-0 w-full h-[80vh] md:h-[90vh] snap-center overflow-hidden group`}
                        >
                            {/* Immersive Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={lane.image}
                                    alt={lane.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>

                            {/* Warm Atmospheric Gradient Overlays */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-80'}`}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40"></div>

                            {/* Interactive Radial Glow */}
                            <div className={`absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent ${isActive ? 'opacity-30' : 'opacity-0'}`}></div>

                            {/* Cinematic Floating Content */}
                            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 lg:px-32 max-w-7xl z-10">
                                {/* Accent Line */}
                                <div className={`w-12 h-1 mb-6 rounded-full bg-current ${lane.accent} transform transition-all duration-700 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}></div>

                                <h3 className={`text-sm md:text-base font-black tracking-[0.4em] uppercase mb-4 ${lane.accent} transform transition-all duration-700 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    {lane.subtitle}
                                </h3>

                                <h2 className={`text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform transition-all duration-1000 delay-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                                    {lane.title}
                                </h2>

                                <p className={`text-white/70 text-lg md:text-xl lg:text-2xl font-medium max-w-2xl leading-relaxed mb-10 transform transition-all duration-1000 delay-400 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                    {lane.description}
                                </p>

                                <div className={`transform transition-all duration-700 delay-600 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                    <button className="group/btn relative inline-flex items-center gap-4 bg-white text-black px-8 md:px-10 py-4 md:py-5 rounded-full overflow-hidden transition-all hover:pr-10">
                                        <span className="relative z-10 text-lg md:text-xl font-black uppercase tracking-widest">{lane.cta}</span>
                                        <ChevronRight className="relative z-10 w-6 h-6 md:w-7 md:h-7 transition-transform group-hover/btn:translate-x-2" />
                                        <div className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500"></div>
                                    </button>
                                </div>
                            </div>

                            {/* Visual Depth Elements */}
                            <div className={`absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none`}></div>
                            <div className={`absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none`}></div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll Progress Indicator */}
            <div className="absolute bottom-10 right-10 flex gap-3 z-20">
                {lanes.map((_, i) => (
                    <div
                        key={i}
                        className="w-12 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                        onClick={() => {
                            isMovingProgrammatically.current = false; // Allow click to override
                            setCurrentIndex(i);
                        }}
                    >
                        <div
                            className={`h-full bg-white transition-all duration-500 ${i === currentIndex ? 'w-full' : 'w-0'}`}
                        ></div>
                    </div>
                ))}
            </div>

            <style jsx="true">{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default FoodLanes;
