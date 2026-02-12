import React, { useState } from 'react';
import { X, MapPin, Home, Briefcase, Plus, Loader2 } from 'lucide-react';
import { addressApi } from '../../services/addressApi';
import Button from '../common/Button';

const AddressModal = ({ isOpen, onClose, addresses, onSelect, onAddressAdded }) => {
    const [view, setView] = useState('list'); // 'list' or 'add'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        label: 'Home',
        name: '',
        phone: '',
        street: '',
        area: '',
        city: 'Bangalore',
        pincode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newAddress = await addressApi.addAddress(formData);
            onAddressAdded(newAddress);
            setView('list');
            setLoading(false);
        } catch (error) {
            console.error("Failed to add address:", error);
            const errorMsg = error.response?.data?.message || "Failed to save address. Please check your connection.";
            alert(errorMsg);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">
                        {view === 'list' ? 'Select Delivery Address' : 'Add New Address'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {view === 'list' ? (
                        <div className="space-y-4">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id || addr._id?.$oid}
                                    onClick={() => {
                                        onSelect(addr);
                                        onClose();
                                    }}
                                    className="p-4 border-2 border-gray-100 hover:border-blue-200 rounded-2xl cursor-pointer transition-all flex gap-4 group"
                                >
                                    <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600">
                                        {addr.label?.toLowerCase() === 'home' ? <Home size={20} /> :
                                            addr.label?.toLowerCase() === 'work' ? <Briefcase size={20} /> :
                                                <MapPin size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-bold text-gray-900">{addr.label || 'Home'}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 leading-snug">
                                            {addr.address || `${addr.street}, ${addr.area}, ${addr.city} - ${addr.pincode}`}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">{addr.name} • {addr.phone}</p>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setView('add')}
                                className="w-full p-4 border-2 border-dashed border-gray-200 hover:border-blue-600 rounded-2xl flex items-center justify-center gap-2 text-blue-700 font-bold transition-all"
                            >
                                <Plus size={20} />
                                Add New Address
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleAddAddress} className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {['Home', 'Work', 'Other'].map(l => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, label: l }))}
                                        className={`py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${formData.label === l ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Receiver Name</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none font-bold"
                                    placeholder="e.g. Sneha"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                <input
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none font-bold"
                                    placeholder="10-digit mobile number"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street / Flat No</label>
                                <input
                                    required
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none font-bold"
                                    placeholder="e.g. 12/4 MG Road"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Area / Locality</label>
                                    <input
                                        required
                                        name="area"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none font-bold"
                                        placeholder="e.g. Indiranagar"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Pincode</label>
                                    <input
                                        required
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-blue-600 focus:bg-white transition-all outline-none font-bold"
                                        placeholder="6 digits"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1 font-bold py-4"
                                    onClick={() => setView('list')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-2 bg-blue-600 hover:bg-blue-700 py-4 font-black uppercase tracking-widest"
                                    isLoading={loading}
                                >
                                    Save Address
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
