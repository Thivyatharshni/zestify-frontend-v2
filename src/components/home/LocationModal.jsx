import React, { useState } from 'react';
import { MapPin, X, Crosshair } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import Button from '../common/Button';

const LocationModal = () => {
    const { isModalOpen, setIsModalOpen, location, updateLocation, isDetecting, setIsDetecting } = useLocation();
    const [searchText, setSearchText] = useState('');

    if (!isModalOpen) return null;

    const handleSetLocation = (address, coordinates) => {
        updateLocation(address, coordinates);
        setIsModalOpen(false);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // For now, we'll use a placeholder address, but in a real app, 
                // we'd use reverse geocoding here.
                handleSetLocation("Current Location", { lat: latitude, lng: longitude });
                setIsDetecting(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                let errorMessage = "Unable to retrieve your location";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "Location access denied. Please search manually or enable permissions.";
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = "Location request timed out.";
                }
                alert(errorMessage);
                setIsDetecting(false);
            },
            { timeout: 10000 }
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Change Location</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for area, street name..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-gray-900 placeholder:text-gray-400"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <MapPin size={20} />
                        </div>
                    </div>

                    <button
                        className="w-full flex items-center gap-3 p-3 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors group disabled:opacity-50"
                        onClick={handleDetectLocation}
                        disabled={isDetecting}
                    >
                        <Crosshair size={20} className={`${isDetecting ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                        <div className="text-left">
                            <div className="font-semibold">{isDetecting ? "Detecting..." : "Use Current Location"}</div>
                            <div className="text-xs text-gray-500">Using GPS</div>
                        </div>
                    </button>

                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Saved Addresses</div>
                        <button
                            onClick={() => handleSetLocation("Home", { lat: 40.7128, lng: -74.0060 })}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                                <MapPin size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Home</div>
                                <div className="text-xs text-gray-500 truncate">123 Main St, Apt 4B, New York, NY</div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleSetLocation("Work", { lat: 37.3861, lng: -122.0838 })}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                                <MapPin size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">Work</div>
                                <div className="text-xs text-gray-500 truncate">456 Tech Park, Silicon Valley, CA</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
