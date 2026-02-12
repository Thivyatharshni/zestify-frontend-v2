import React, { useState, useEffect } from 'react';
import { Grid, Plus, Trash2, Edit, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import {
    Card,
    Button,
    Input,
    Loader,
    Table,
    Badge,
    Modal,
    EmptyState,
    cn
} from '../../components/ui/DashboardUI';
import { CATEGORIES } from '../../mocks/categories.mock';
import { getCategoryFallbackImage } from '../../utils/categoryUtils';
import { cmsApi } from '../../services/dashboard/cmsApi';
import toast from 'react-hot-toast';

const CMSCategoryEditor = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await cmsApi.getCategories();
            if (response.data.success && response.data.data.length > 0) {
                setCategories(response.data.data);
            } else {
                // AUTO-SEED: If CMS is empty, fetch current landing page data and seed it
                toast.loading('Initializing CMS with current categories...');
                const apiData = await cmsApi.getCategories(); // Need to re-check if it was truly empty
                if (apiData.data.data.length === 0) {
                    const { restaurantApi } = await import('../../services/restaurantApi');
                    const backendData = await restaurantApi.getCategories();
                    const backendCats = Array.isArray(backendData) ? backendData : [];
                    const merged = [...backendCats];

                    CATEGORIES.forEach(mockCat => {
                        if (!merged.find(c => c.name.toLowerCase() === mockCat.name.toLowerCase())) {
                            merged.push(mockCat);
                        }
                    });

                    // Seed into CMS
                    for (const cat of merged) {
                        await cmsApi.createCategory({
                            name: cat.name,
                            image: getCategoryFallbackImage(cat.name) || cat.image,
                            order: cat.id || 0,
                            isActive: true
                        });
                    }

                    const finalResponse = await cmsApi.getCategories();
                    setCategories(finalResponse.data.data);
                    toast.dismiss();
                    toast.success('CMS initialized with current categories');
                }
            }
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        setSelectedFile(null);
        if (category) {
            setEditingCategory(category);
            setFormData(category);
        } else {
            setEditingCategory(null);
            setFormData({ name: '', image: '', order: categories.length, isActive: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUploading(selectedFile ? true : false);

            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('order', formData.order);
            fd.append('isActive', formData.isActive);

            if (selectedFile) {
                fd.append('file', selectedFile);
            } else {
                fd.append('image', formData.image);
            }

            if (editingCategory) {
                await cmsApi.updateCategory(editingCategory._id, fd);
                toast.success('Category updated');
            } else {
                await cmsApi.createCategory(fd);
                toast.success('Category created');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error('Failed to save category');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await cmsApi.deleteCategory(id);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <LayoutGrid className="text-white" size={28} />
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                                Category CMS
                            </h1>
                        </div>
                        <p className="text-white/70 text-sm sm:text-base font-medium">Manage landing page categories and their priority</p>
                    </div>
                    <div className="flex gap-4">
                        <Button dark onClick={() => handleOpenModal()} className="gap-2 px-6 shadow-xl w-full sm:w-auto">
                            <Plus size={20} />
                            Add Category
                        </Button>
                    </div>
                </div>
            </div>

            {categories.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <div className="overflow-x-auto">
                        <Table headers={['Preview', 'Category Name', 'Order', 'Status', 'Actions']} dark className="min-w-[700px]">
                            {categories.map((category) => (
                                <tr key={category._id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                                            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-lg font-black text-white">{category.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="neutral" dark className="text-sm px-4">Priority {category.order}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {category.isActive ? (
                                            <Badge variant="success" dark>Active</Badge>
                                        ) : (
                                            <Badge variant="neutral" dark>Inactive</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" dark onClick={() => handleOpenModal(category)} className="p-2.5 h-auto rounded-xl">
                                                <Edit size={18} />
                                            </Button>
                                            <Button variant="danger" dark onClick={() => handleDelete(category._id)} className="p-2.5 h-auto rounded-xl opacity-60 hover:opacity-100">
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                </div>
            ) : (
                <EmptyState title="No CMS Categories" message="Start adding categories to override default ones." icon={Grid} dark />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
                dark
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button dark onClick={handleSubmit} disabled={uploading}>
                            {uploading ? 'Uploading...' : editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </>
                )}
            >
                <div className="space-y-5">
                    <Input
                        label="Category Name"
                        placeholder="e.g. Biryani"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        dark
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60">Category Image</label>
                        <div className="flex gap-4">
                            <Input
                                placeholder="Paste image URL..."
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                required
                                dark
                                className="flex-1"
                            />
                            <div className="relative">
                                <input
                                    type="file"
                                    id="imageUpload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setSelectedFile(file);
                                        // Create local preview
                                        const url = URL.createObjectURL(file);
                                        setFormData(prev => ({ ...prev, image: url }));
                                        toast.success('Image selected for upload');
                                    }}
                                />
                                <Button
                                    dark
                                    variant="ghost"
                                    type="button"
                                    className="px-4 border-dashed border-2 border-white/20 whitespace-nowrap"
                                    onClick={() => document.getElementById('imageUpload').click()}
                                >
                                    <ImageIcon size={18} className="mr-2" />
                                    Upload File
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Sort Order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            dark
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60">Status</label>
                            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 h-[52px]">
                                <button
                                    className={cn("flex-1 rounded-xl text-sm font-bold transition-all", formData.isActive ? "bg-white/10 text-white shadow-lg" : "text-white/40")}
                                    onClick={() => setFormData({ ...formData, isActive: true })}
                                >
                                    Active
                                </button>
                                <button
                                    className={cn("flex-1 rounded-xl text-sm font-bold transition-all", !formData.isActive ? "bg-red-500/20 text-red-200 shadow-lg" : "text-white/40")}
                                    onClick={() => setFormData({ ...formData, isActive: false })}
                                >
                                    Inactive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CMSCategoryEditor;
