import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Bike,
    Plus,
    Trash2,
    Search,
    Phone,
    Sparkles
} from 'lucide-react';
import {
    Card,
    Button,
    Table,
    Badge,
    Modal,
    Input,
    Loader,
    EmptyState,
    cn
} from '../../components/ui/DashboardUI';
import { adminService } from '../../services/dashboard/adminService';
import toast from 'react-hot-toast';

const AdminDeliveryPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const location = useLocation();
    const highlightId = location.state?.highlightId;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        vehicleNumber: ''
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const response = await adminService.getDeliveryPartners();
            if (response.data.success) {
                setPartners(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load delivery partners');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await adminService.createDeliveryPartner(formData);
            if (response.data.success) {
                toast.success('Delivery partner onboarded');
                setIsAddModalOpen(false);
                resetForm();
                fetchPartners();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create partner');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await adminService.deleteDeliveryPartner(selectedPartner._id);
            if (response.data.success) {
                toast.success('Partner removed');
                setIsDeleteModalOpen(false);
                setSelectedPartner(null);
                fetchPartners();
            }
        } catch (error) {
            toast.error('Failed to delete partner');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            vehicleNumber: ''
        });
    };

    const filteredPartners = partners.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-900/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <Bike className="text-white" size={28} />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-md">
                                Delivery Fleet
                                <Sparkles className="text-yellow-300" size={28} />
                            </h1>
                        </div>
                        <p className="text-white/70 font-medium">Manage rider accounts and assignments</p>
                    </div>
                    <Button dark onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="gap-2 px-6">
                        <Plus size={20} />
                        Add Rider
                    </Button>
                </div>
            </div>

            {/* Glass Search Bar */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all shadow-xl rounded-[2rem] p-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={22} />
                    <input
                        type="text"
                        placeholder="Search delivery partners..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/10 transition-all text-base font-bold text-white placeholder:text-white/40 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredPartners.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <Table headers={['Rider', 'Email', 'Phone', 'Vehicle', 'Status', 'Actions']} dark>
                        {filteredPartners.map((partner) => (
                            <tr
                                key={partner._id}
                                className={cn(
                                    "hover:bg-white/5 transition-all group border-b border-white/5 last:border-0",
                                    highlightId === partner._id && "bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-500/30 scale-[1.01] z-10 relative"
                                )}
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform backdrop-blur-md">
                                            {partner.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-base font-black text-white">{partner.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-white/80">{partner.email}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5 text-white/80">
                                        <Phone size={16} />
                                        <span className="text-sm font-bold">+{partner.phone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-bold text-white/80 uppercase">{partner.vehicleNumber || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-5">
                                    {partner.isOnline ? (
                                        <Badge variant="success" dark className="shadow-sm shadow-emerald-500/10">Online</Badge>
                                    ) : (
                                        <Badge variant="neutral" dark className="shadow-sm shadow-slate-500/10">Offline</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setSelectedPartner(partner); setIsDeleteModalOpen(true); }}
                                            className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-all border border-red-500/30 backdrop-blur-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            ) : (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                    <EmptyState title="No Riders" message="Start onboarding delivery partners." icon={Bike} dark />
                </div>
            )}

            {/* Add Partner Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Onboard Delivery Partner"
                dark
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button dark onClick={handleCreate}>Create Account</Button>
                    </>
                )}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            placeholder="John Rider"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            dark
                        />
                        <Input
                            label="Phone Number"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            dark
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="rider@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            dark
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            dark
                        />
                    </div>

                    <Input
                        label="Vehicle Registration Number"
                        placeholder="KA-01-AB-1234"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        dark
                    />

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Rider Account</p>
                        <p className="text-xs font-medium text-white/50 mt-1">The rider can login with the email and password provided above</p>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Remove Delivery Partner"
                dark
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" dark onClick={handleDelete}>Remove Partner</Button>
                    </>
                )}
            >
                <div className="text-center py-4">
                    <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/10 border border-white/10 backdrop-blur-sm">
                        <Trash2 size={36} />
                    </div>
                    <p className="text-white/80 font-medium text-lg">
                        Remove <span className="font-black text-white">"{selectedPartner?.name}"</span> from the delivery fleet?
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDeliveryPartners;
