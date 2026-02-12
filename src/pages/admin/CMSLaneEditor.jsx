import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit, Image as ImageIcon, Sparkles } from 'lucide-react';
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
import { cmsApi } from '../../services/dashboard/cmsApi';
import { DEFAULT_LANES } from '../../mocks/lanes.mock';
import toast from 'react-hot-toast';

const CMSLaneEditor = () => {
    const [lanes, setLanes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const isSeeding = React.useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLane, setEditingLane] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        cta: '',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchLanes();
    }, []);

    const fetchLanes = async () => {
        if (isSeeding.current) return;
        try {
            setLoading(true);
            const response = await cmsApi.getLanes();
            if (response.data.success && response.data.data.length > 0) {
                setLanes(response.data.data);
            } else if (!isSeeding.current) {
                isSeeding.current = true;
                // AUTO-SEED: If CMS is empty, seed with DEFAULT_LANES
                toast.loading('Initializing CMS with current food lanes...');
                for (const lane of DEFAULT_LANES) {
                    // Final check to prevent race
                    const current = await cmsApi.getLanes();
                    if (!current.data.data.find(l => l.title === lane.title)) {
                        await cmsApi.createLane(lane);
                    }
                }
                const finalResponse = await cmsApi.getLanes();
                setLanes(finalResponse.data.data);
                toast.dismiss();
                toast.success('CMS initialized with food lanes');
                isSeeding.current = false;
            }
        } catch (error) {
            isSeeding.current = false;
            toast.dismiss();
            toast.error('Failed to load lanes');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (lane = null) => {
        setSelectedFile(null);
        if (lane) {
            setEditingLane(lane);
            setFormData(lane);
        } else {
            setEditingLane(null);
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                image: '',
                cta: '',
                order: lanes.length,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUploading(selectedFile ? true : false);

            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('subtitle', formData.subtitle || '');
            fd.append('description', formData.description || '');
            fd.append('cta', formData.cta || '');
            fd.append('order', formData.order);
            fd.append('isActive', formData.isActive);

            if (selectedFile) {
                fd.append('file', selectedFile);
            } else {
                fd.append('image', formData.image);
            }

            if (editingLane) {
                await cmsApi.updateLane(editingLane._id, fd);
                toast.success('Lane updated');
            } else {
                await cmsApi.createLane(fd);
                toast.success('Lane created');
            }
            setIsModalOpen(false);
            fetchLanes();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to save lane';
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lane?')) return;
        try {
            await cmsApi.deleteLane(id);
            toast.success('Lane deleted');
            fetchLanes();
        } catch (error) {
            toast.error('Failed to delete lane');
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <Layers className="text-white" size={28} />
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                                Food Lanes CMS
                            </h1>
                        </div>
                        <p className="text-white/70 text-sm sm:text-base font-medium tracking-wide">Manage featured story-like sections on landing page</p>
                    </div>
                    <div className="flex gap-4">
                        <Button dark onClick={() => handleOpenModal()} className="gap-2 px-6 shadow-xl w-full sm:w-auto">
                            <Plus size={20} />
                            Add New Lane
                        </Button>
                    </div>
                </div>
            </div>

            {lanes.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <div className="overflow-x-auto">
                        <Table headers={['Preview', 'Details', 'Order', 'Status', 'Actions']} dark className="min-w-[800px]">
                            {lanes.map((lane) => (
                                <tr key={lane._id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-36 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                                            <img src={lane.image} alt={lane.title} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <h4 className="text-lg font-black text-white">{lane.title}</h4>
                                        <p className="text-sm text-white/50 mt-1 font-bold">{lane.subtitle || 'N/A'}</p>
                                        <p className="text-xs text-white/30 max-w-xs mt-2 line-clamp-2">{lane.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="neutral" dark className="px-4">Priority {lane.order}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {lane.isActive ? (
                                            <Badge variant="success" dark>Active</Badge>
                                        ) : (
                                            <Badge variant="neutral" dark>Inactive</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" dark onClick={() => handleOpenModal(lane)} className="p-2.5 h-auto rounded-xl">
                                                <Edit size={18} />
                                            </Button>
                                            <Button variant="danger" dark onClick={() => handleDelete(lane._id)} className="p-2.5 h-auto rounded-xl opacity-60 hover:opacity-100">
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
                <EmptyState title="No Food Lanes" message="Create cinematic lanes to highlight special collections." icon={Layers} dark />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingLane ? 'Edit Lane' : 'Create New Lane'}
                dark
                size="lg"
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button dark onClick={handleSubmit} disabled={uploading}>
                            {uploading ? 'Uploading...' : editingLane ? 'Update Lane' : 'Create Lane'}
                        </Button>
                    </>
                )}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Input
                            label="Lane Title"
                            placeholder="e.g. Curated for you"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            dark
                        />
                        <Input
                            label="Subtitle (Optional)"
                            placeholder="e.g. Hand-picked restaurants"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            dark
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60">Description</label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium resize-none focus:ring-4 focus:ring-white/10 outline-none transition-all h-24"
                                placeholder="..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60">Background Image</label>
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Paste cinematic image URL..."
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    required
                                    dark
                                    className="flex-1"
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="laneImageUpload"
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
                                        onClick={() => document.getElementById('laneImageUpload').click()}
                                    >
                                        <ImageIcon size={18} className="mr-2" />
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Input
                            label="Call to Action (Button Text)"
                            placeholder="e.g. See all"
                            value={formData.cta}
                            onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                            dark
                        />
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
                </div>
            </Modal>
        </div>
    );
};

export default CMSLaneEditor;
