import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    Filter
} from 'lucide-react';
import {
    Card,
    Button,
    Input,
    Table,
    Badge,
    Modal,
    Pagination,
    Loader,
    EmptyState,
    Textarea
} from '../../components/ui/DashboardUI';
import { restaurantApi } from '../../services/dashboard/restaurantService';
import toast from 'react-hot-toast';

const MenuManagement = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        isVeg: true,
        isAvailable: true,
        imageUrl: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, [page, searchTerm]);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const response = await restaurantApi.getMenu({
                page,
                limit: 8,
                search: searchTerm
            });
            if (response.data.success) {
                setMenu(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            toast.error('Failed to load menu items');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const dummyFormData = new FormData();
        dummyFormData.append('image', file);

        try {
            setUploading(true);
            const response = await restaurantApi.uploadImage(dummyFormData);
            if (response.data.success) {
                setFormData({ ...formData, imageUrl: response.data.imageUrl });
                toast.success('Image uploaded successfully');
            }
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await restaurantApi.addMenuItem(formData);
            if (response.data.success) {
                toast.success('Menu item added');
                setIsAddModalOpen(false);
                resetForm();
                fetchMenu();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add item');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await restaurantApi.updateMenuItem(selectedItem._id, formData);
            if (response.data.success) {
                toast.success('Menu item updated');
                setIsEditModalOpen(false);
                setSelectedItem(null);
                resetForm();
                fetchMenu();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update item');
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            const response = await restaurantApi.deleteMenuItem(selectedItem._id);
            if (response.data.success) {
                toast.success('Item deleted successfully');
                setIsDeleteModalOpen(false);
                setSelectedItem(null);
                fetchMenu();
            }
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            isVeg: true,
            isAvailable: true,
            imageUrl: ''
        });
    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            isVeg: item.isVeg,
            isAvailable: item.isAvailable,
            imageUrl: item.imageUrl
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Menu Inventory</h1>
                    <p className="text-white/50 font-medium italic mt-1">Manage your dishes, pricing, and availability</p>
                </div>
                <Button dark onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="gap-2 px-6">
                    <Plus size={20} />
                    Add New Dish
                </Button>
            </div>

            <Card dark className="p-4 border-dashed">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by dish name or category..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/5 transition-all text-sm font-bold text-white placeholder:text-white/30 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button dark variant="outline" className="gap-2 sm:w-auto w-full h-[52px]">
                        <Filter size={18} />
                        Filters
                    </Button>
                </div>
            </Card>

            {/* Menu List */}
            {loading ? (
                <Loader dark />
            ) : menu.length > 0 ? (
                <>
                    <Table dark headers={['Dish', 'Category', 'Price', 'Type', 'Status', 'Actions']}>
                        {menu.map((item) => (
                            <tr key={item._id} className="hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0 font-medium">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-sm" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 border border-white/10">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-sm font-black text-white tracking-tight">{item.name}</h4>
                                            <p className="text-xs text-white/40 font-medium max-w-[200px] truncate">{item.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-black text-white/60 uppercase tracking-widest">{item.category}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-black text-white">₹{item.price}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {item.isVeg ? (
                                        <Badge dark variant="success">Veg</Badge>
                                    ) : (
                                        <Badge dark variant="danger">Non-Veg</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {item.isAvailable ? (
                                        <div className="flex items-center gap-1.5 text-emerald-400">
                                            <CheckCircle2 size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-white/30">
                                            <XCircle size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Hidden</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2 hover:bg-white/10 text-white/50 hover:text-blue-400 rounded-xl transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
                                            className="p-2 hover:bg-red-500/20 text-white/30 hover:text-red-400 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </Table>
                    <Pagination
                        dark
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            ) : (
                <EmptyState dark title="No Items Found" message="Try searching for something else or add a new dish." />
            )}

            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <Modal
                    isOpen={true}
                    onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                    title={isAddModalOpen ? 'Create New Dish' : 'Edit Dish Details'}
                    dark
                    footer={(
                        <>
                            <Button dark variant="ghost" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Cancel</Button>
                            <Button dark onClick={isAddModalOpen ? handleAddSubmit : handleEditSubmit}>
                                {isAddModalOpen ? 'Save Item' : 'Update Item'}
                            </Button>
                        </>
                    )}
                >
                    <div className="space-y-6">
                        <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10 group relative overflow-hidden">
                            {formData.imageUrl ? (
                                <>
                                    <img src={formData.imageUrl} className="w-full h-40 object-cover rounded-2xl" />
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                                        <label className="cursor-pointer bg-white text-slate-900 p-3 rounded-2xl font-bold text-xs shadow-xl">Change Image</label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-white/20 mb-2" size={32} />
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                        {uploading ? 'Uploading...' : 'Click to Upload Image'}
                                    </p>
                                </>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                dark
                                label="Dish Name"
                                placeholder="e.g. Paneer Butter Masala"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <Input
                                dark
                                label="Price (₹)"
                                type="number"
                                placeholder="299"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <Input
                            dark
                            label="Category"
                            placeholder="e.g. Main Course, Starters"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />

                        <Textarea
                            dark
                            label="Short Description"
                            placeholder="Describe the taste, ingredients, etc."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <div className="flex items-center gap-8 px-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/20"
                                    checked={formData.isVeg}
                                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Vegetarian</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/20"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Available</span>
                            </label>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                dark
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Menu Item"
                footer={(
                    <>
                        <Button dark variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Keep Item</Button>
                        <Button dark variant="danger" onClick={handleDeleteSubmit}>Yes, Delete</Button>
                    </>
                )}
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-lg shadow-red-500/10">
                        <Trash2 size={32} />
                    </div>
                    <p className="text-white/60 font-medium font-sans">
                        Are you sure you want to delete <span className="font-black text-white">"{selectedItem?.name}"</span>?
                        This will remove it from the customer marketplace.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default MenuManagement;
