import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Save, PlayCircle, Image as ImageIcon, Zap, Edit } from 'lucide-react';
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
import { COUPONS } from '../../mocks/coupons.mock';
import { cmsApi } from '../../services/dashboard/cmsApi';
import toast from 'react-hot-toast';

const CMSOfferEditor = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const isSeeding = React.useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mediaUrl: '',
        mediaType: 'image',
        order: 0,
        isActive: true
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        if (isSeeding.current) return;
        try {
            setLoading(true);
            const response = await cmsApi.getOffers();
            if (response.data.success && response.data.data.length > 0) {
                setOffers(response.data.data);
            } else if (!isSeeding.current) {
                isSeeding.current = true;
                toast.loading('Initializing CMS with current offers...');

                const { couponApi } = await import('../../services/couponApi');
                const coupons = await couponApi.getApplicableCoupons();
                const backendCoupons = Array.isArray(coupons) ? coupons : [];
                const merged = [...backendCoupons];

                COUPONS.forEach(mockC => {
                    if (!merged.find(c => c.code === mockC.code)) {
                        merged.push(mockC);
                    }
                });

                // SEED VIDEOS: Use the user's original videos
                const videoData = [
                    { title: "Zestify Special", path: "https://res.cloudinary.com/dnpk9egyk/video/upload/v1739165314/zestify/videos/offer1.mp4" },
                    { title: "Gourmet Deals", path: "https://res.cloudinary.com/dnpk9egyk/video/upload/v1739165314/zestify/videos/offer2.mp4" },
                    { title: "Flash Sale", path: "https://res.cloudinary.com/dnpk9egyk/video/upload/v1739165314/zestify/videos/offer3.mp4" }
                ];

                for (let i = 0; i < 3; i++) {
                    const current = await cmsApi.getOffers();
                    const v = videoData[i];
                    const coupon = merged[i] || {};

                    if (!current.data.data.find(o => o.title === v.title)) {
                        await cmsApi.createOffer({
                            title: v.title,
                            description: coupon.description || "Premium dining experiences at your doorstep.",
                            mediaUrl: v.path,
                            mediaType: 'video',
                            order: i,
                            isActive: true
                        });
                    }
                }

                const finalResponse = await cmsApi.getOffers();
                setOffers(finalResponse.data.data);
                toast.dismiss();
                toast.success('CMS initialized with current promotions');
                isSeeding.current = false;
            }
        } catch (error) {
            isSeeding.current = false;
            toast.dismiss();
            toast.error('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (offer = null) => {
        setSelectedFile(null);
        if (offer) {
            setEditingOffer(offer);
            setFormData(offer);
        } else {
            setEditingOffer(null);
            setFormData({
                title: '',
                description: '',
                mediaUrl: '',
                mediaType: 'image',
                order: offers.length,
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
            fd.append('description', formData.description || '');
            fd.append('order', formData.order);
            fd.append('isActive', formData.isActive);
            fd.append('mediaType', formData.mediaType);

            if (selectedFile) {
                fd.append('file', selectedFile);
            } else {
                fd.append('mediaUrl', formData.mediaUrl);
            }

            if (editingOffer) {
                await cmsApi.updateOffer(editingOffer._id, fd);
                toast.success('Offer updated');
            } else {
                await cmsApi.createOffer(fd);
                toast.success('Offer created');
            }
            setIsModalOpen(false);
            fetchOffers();
        } catch (error) {
            toast.error('Failed to save offer');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer banner?')) return;
        try {
            await cmsApi.deleteOffer(id);
            toast.success('Offer removed');
            fetchOffers();
        } catch (error) {
            toast.error('Failed to delete offer');
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <Zap className="text-white" size={28} />
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                                Promotions CMS
                            </h1>
                        </div>
                        <p className="text-white/70 text-sm sm:text-base font-medium">Manage top-banner offers and campaigns</p>
                    </div>
                    <div className="flex gap-4">
                        <Button dark onClick={() => handleOpenModal()} className="gap-2 px-6 shadow-xl w-full sm:w-auto">
                            <Plus size={20} />
                            Create Campaign
                        </Button>
                    </div>
                </div>
            </div>

            {offers.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <div className="overflow-x-auto">
                        <Table headers={['Banner', 'Details', 'Order', 'Status', 'Actions']} dark className="min-w-[800px]">
                            {offers.map((offer) => (
                                <tr key={offer._id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="w-48 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                                            {offer.mediaType === 'video' ? (
                                                <video src={offer.mediaUrl} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={offer.mediaUrl} alt={offer.title} className="w-full h-full object-cover" />
                                            )}
                                            {offer.mediaType === 'video' && (
                                                <div className="absolute top-2 right-2 p-1 bg-black/60 rounded-lg">
                                                    <PlayCircle size={14} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <h4 className="text-lg font-black text-white">{offer.title}</h4>
                                        <p className="text-sm text-white/50 mt-1 font-bold line-clamp-2 max-w-xs">{offer.description || 'No description provided'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="neutral" dark className="px-4">Priority {offer.order}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {offer.isActive ? (
                                            <Badge variant="success" dark>Active</Badge>
                                        ) : (
                                            <Badge variant="neutral" dark>Inactive</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" dark onClick={() => handleOpenModal(offer)} className="p-2.5 h-auto rounded-xl">
                                                <Edit size={18} />
                                            </Button>
                                            <Button variant="danger" dark onClick={() => handleDelete(offer._id)} className="p-2.5 h-auto rounded-xl opacity-60 hover:opacity-100">
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
                <EmptyState title="No Active Campaigns" message="Create banners to showcase deals on the landing page." icon={Zap} dark />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingOffer ? 'Edit Campaign' : 'New Campaign Offer'}
                dark
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button dark onClick={handleSubmit} disabled={uploading}>
                            {uploading ? 'Uploading...' : editingOffer ? 'Save Campaign' : 'Launch Campaign'}
                        </Button>
                    </>
                )}
            >
                <div className="space-y-5">
                    <Input
                        label="Offer Title"
                        placeholder="e.g. 50% OFF FLAT"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        dark
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/60">Subtext / Description</label>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium resize-none focus:ring-4 focus:ring-white/10 outline-none transition-all h-24"
                            placeholder="Details about the offer..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60">Media (Image or Video)</label>
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Paste media URL..."
                                    value={formData.mediaUrl}
                                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                                    required
                                    dark
                                    className="flex-1"
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="offerMediaUpload"
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            setSelectedFile(file);
                                            const isVideo = file.type.startsWith('video/');
                                            // Create local preview
                                            const url = URL.createObjectURL(file);
                                            setFormData(prev => ({
                                                ...prev,
                                                mediaUrl: url,
                                                mediaType: isVideo ? 'video' : 'image'
                                            }));
                                            toast.success(`${isVideo ? 'Video' : 'Image'} selected for upload`);
                                        }}
                                    />
                                    <Button
                                        dark
                                        variant="ghost"
                                        type="button"
                                        className="px-4 border-dashed border-2 border-white/20 whitespace-nowrap"
                                        onClick={() => document.getElementById('offerMediaUpload').click()}
                                    >
                                        <ImageIcon size={18} className="mr-2" />
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60">Media Type</label>
                            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 h-[52px]">
                                <button
                                    className={cn("flex-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1", formData.mediaType === 'image' ? "bg-white/10 text-white shadow-lg" : "text-white/40")}
                                    onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                                >
                                    <ImageIcon size={14} /> IMAGE
                                </button>
                                <button
                                    className={cn("flex-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1", formData.mediaType === 'video' ? "bg-white/10 text-white shadow-lg" : "text-white/40")}
                                    onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                                >
                                    <PlayCircle size={14} /> VIDEO
                                </button>
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

export default CMSOfferEditor;
