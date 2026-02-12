import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { restaurantApi } from '../../services/restaurantApi';
import { formatPrice } from '../../utils/formatPrice';
import Button from '../common/Button';

const AddonsModal = ({ isOpen, onClose, menuItem, onAdd }) => {
    const [addonsData, setAddonsData] = useState({ required: [], optional: [] });
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && menuItem) {
            const fetchAddonsData = async () => {
                setLoading(true);
                console.log('🔍 AddonsModal - Fetching addons for:', menuItem);
                try {
                    // If menuItem already has addons (as per user example), use them
                    if (Array.isArray(menuItem.addons) && menuItem.addons.length > 0) {
                        console.log('✅ Using embedded addons from menuItem:', menuItem.addons);
                        setAddonsData({
                            required: menuItem.addons.filter(a => a.isRequired),
                            optional: menuItem.addons.filter(a => !a.isRequired)
                        });
                        setLoading(false);
                        return;
                    }

                    const itemId = menuItem.id; // Already normalized by Restaurant.jsx
                    console.log('📡 Fetching addons from API for itemId:', itemId);
                    const data = await restaurantApi.getAddons(itemId);
                    console.log('📦 Received addons data:', data);
                    // Filter for available addons only
                    const processedData = {
                        required: (data.required || []).filter(a => a.isAvailable !== false),
                        optional: (data.optional || []).filter(a => a.isAvailable !== false)
                    };
                    console.log('✅ Processed addons data:', processedData);
                    setAddonsData(processedData);
                } catch (error) {
                    console.error("❌ Failed to fetch addons:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAddonsData();
        }
    }, [isOpen, menuItem]);

    const toggleAddon = (addon, isRequired) => {
        const addonId = addon._id || addon.id;
        const exists = selectedAddons.find(a => (a._id || a.id) === addonId);

        if (exists) {
            setSelectedAddons(selectedAddons.filter(a => (a._id || a.id) !== addonId));
        } else {
            setSelectedAddons([...selectedAddons, addon]);
        }
    };

    const isAllRequiredSelected = () => {
        if (addonsData.required.length > 0) {
            const requiredSelected = selectedAddons.filter(a =>
                addonsData.required.some(r => (r._id || r.id) === (a._id || a.id))
            );
            return requiredSelected.length > 0;
        }
        return true;
    };

    const handleConfirm = () => {
        onAdd(selectedAddons);
        onClose();
        setSelectedAddons([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slide-up sm:animate-fade-in shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{menuItem.name}</h3>
                        <p className="text-sm text-gray-500">Customize your order</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-8">
                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {addonsData.required.length > 0 && (
                                <section>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-gray-900">Required Options</h4>
                                        <span className="text-[10px] px-2 py-1 bg-red-50 text-red-600 font-black rounded uppercase">Selection Required</span>
                                    </div>
                                    <div className="space-y-3">
                                        {addonsData.required.map(addon => {
                                            const addonId = addon._id || addon.id;
                                            const isSelected = selectedAddons.some(a => (a._id || a.id) === addonId);
                                            return (
                                                <div
                                                    key={addonId}
                                                    onClick={() => toggleAddon(addon)}
                                                    className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                                                        ? 'border-blue-600 bg-blue-50/30'
                                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {isSelected ? (
                                                            <CheckCircle2 size={20} className="text-blue-600" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                        )}
                                                        <span className="font-medium text-gray-700">{addon.name}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">+{formatPrice(addon.price)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {addonsData.optional.length > 0 && (
                                <section>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-gray-900">Add-ons (Optional)</h4>
                                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-500 font-black rounded uppercase text-xs">Optional</span>
                                    </div>
                                    <div className="space-y-3">
                                        {addonsData.optional.map(addon => {
                                            const addonId = addon._id || addon.id;
                                            const isSelected = selectedAddons.some(a => (a._id || a.id) === addonId);
                                            return (
                                                <div
                                                    key={addonId}
                                                    onClick={() => toggleAddon(addon)}
                                                    className={`flex justify-between items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                                                        ? 'border-blue-600 bg-blue-50/30'
                                                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {isSelected ? (
                                                            <CheckCircle2 size={20} className="text-blue-600" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                        )}
                                                        <span className="font-medium text-gray-700">{addon.name}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">+{formatPrice(addon.price)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <span className="text-sm font-medium text-gray-500">Total Price</span>
                        <span className="text-xl font-black text-gray-900">
                            {formatPrice(menuItem.price + selectedAddons.reduce((acc, a) => acc + a.price, 0))}
                        </span>
                    </div>
                    <Button
                        variant="primary"
                        fullWidth
                        disabled={!isAllRequiredSelected()}
                        onClick={handleConfirm}
                        className="py-4 text-lg font-black shadow-lg shadow-blue-200"
                    >
                        Add Item to Cart • {formatPrice(menuItem.price + selectedAddons.reduce((acc, a) => acc + a.price, 0))}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddonsModal;
