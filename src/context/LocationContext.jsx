import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(() => {
        const saved = localStorage.getItem('userLocation');
        return saved ? JSON.parse(saved) : null;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [restaurantCount, setRestaurantCount] = useState(0);

    useEffect(() => {
        localStorage.setItem('userLocation', JSON.stringify(location));
    }, [location]);

    const updateLocation = (address, coordinates) => {
        setLocation({ address, coordinates });
    };

    const clearLocation = () => {
        setLocation(null);
        localStorage.removeItem('userLocation');
    };

    return (
        <LocationContext.Provider value={{
            location,
            updateLocation,
            clearLocation,
            isModalOpen,
            setIsModalOpen,
            isDetecting,
            setIsDetecting,
            restaurantCount,
            setRestaurantCount
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
