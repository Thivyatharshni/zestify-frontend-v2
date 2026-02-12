import React from 'react';
import { Home, Briefcase, MapPin, MoreVertical } from 'lucide-react';

const AddressList = () => {
    const [addresses, setAddresses] = React.useState([
        { id: 1, type: "Home", address: "123 Main St, Apt 4B, New York, NY 10001", icon: Home },
        { id: 2, type: "Work", address: "456 Tech Park, Silicon Valley, CA 94000", icon: Briefcase },
        { id: 3, type: "Other", address: "789 Park Ave, Boston, MA 02101", icon: MapPin },
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            setAddresses(addresses.filter(a => a.id !== id));
        }
    };

    const handleEdit = (id) => {
        const addrToEdit = addresses.find(a => a.id === id);
        const newAddress = window.prompt("Edit Address:", addrToEdit.address);
        if (newAddress !== null && newAddress.trim() !== "") {
            setAddresses(addresses.map(a => a.id === id ? { ...a, address: newAddress } : a));
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Addresses</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                    <div key={addr.id} className="border border-gray-200 rounded-lg p-4 relative group hover:border-blue-200 transition-colors">
                        <div className="flex items-start gap-3">
                            <addr.icon size={20} className="text-gray-400 mt-1" />
                            <div>
                                <h3 className="font-bold text-gray-900">{addr.type}</h3>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    {addr.address}
                                </p>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical size={16} />
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex gap-4 text-sm font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(addr.id)} className="hover:text-blue-800">EDIT</button>
                            <button onClick={() => handleDelete(addr.id)} className="hover:text-blue-800">DELETE</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddressList;
