import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Video, Type } from 'lucide-react';
import {
    Card,
    Button,
    Input,
    Loader,
    Badge,
    cn
} from '../../components/ui/DashboardUI';
import { cmsApi } from '../../services/dashboard/cmsApi';
import toast from 'react-hot-toast';

const CMSHeroEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        videoUrl: '',
        buttonText: ''
    });

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            setLoading(true);
            const response = await cmsApi.getHero();
            if (response.data.success && response.data.data) {
                console.log("✅ CMS API Data:", response.data.data);
                setFormData(response.data.data);
            } else {
                // Pre-fill with defaults if no CMS data exists
                setFormData({
                    title: 'Taste the Extraordinary',
                    subtitle: 'Discover the finest culinary experiences delivered with precision and passion to your doorstep.',
                    videoUrl: 'https://res.cloudinary.com/dnpk9egyk/video/upload/v1739165314/zestify/videos/hero-background.mp4',
                    buttonText: 'EXPLORE NOW'
                });
            }
        } catch (error) {
            console.error('Failed to load hero section');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setUploading(selectedFile ? true : false);

            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('subtitle', formData.subtitle);
            fd.append('buttonText', formData.buttonText);

            if (selectedFile) {
                fd.append('file', selectedFile);
            } else {
                fd.append('videoUrl', formData.videoUrl);
            }

            const response = await cmsApi.updateHero(fd);
            if (response.data.success) {
                toast.success('Hero section updated successfully');
                setSelectedFile(null);
                fetchHero(); // Re-fetch to get fresh data and bust cache
            }
        } catch (error) {
            toast.error('Failed to update hero section');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                            <Sparkles className="text-white" size={28} />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-md">
                            Hero Section CMS
                        </h1>
                    </div>
                    <p className="text-white/70 text-sm sm:text-base font-medium tracking-wide">Customize the first impression of your landing page</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Form */}
                <Card dark className="p-4 sm:p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                        <Type size={20} className="text-purple-400" />
                        Content Details
                    </h3>

                    <form onSubmit={handleSave} className="space-y-6">
                        <Input
                            label="Main Title"
                            placeholder="e.g. Delicious Food Delivered To Your Doorstep"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            dark
                        />
                        <Input
                            label="Subtext / Description"
                            placeholder="e.g. Choose from thousands of restaurants..."
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            required
                            dark
                        />
                        <Input
                            label="Button Text"
                            placeholder="e.g. Order Now"
                            value={formData.buttonText}
                            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                            required
                            dark
                        />

                        <div className="pt-4 border-t border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                <Video size={20} className="text-blue-400" />
                                Background Media
                            </h3>
                            <div className="flex gap-4">
                                <Input
                                    label="Background Video URL (Auto-updated on upload)"
                                    placeholder="Paste a direct video link..."
                                    value={formData.videoUrl}
                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                    required
                                    dark
                                    className="flex-1"
                                />
                                <div className="relative pt-8">
                                    <input
                                        type="file"
                                        id="heroVideoUpload"
                                        className="hidden"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                // Create a local preview URL
                                                const url = URL.createObjectURL(file);
                                                setFormData({ ...formData, videoUrl: url });
                                                toast.success('Video selected for upload');
                                            }
                                        }}
                                    />
                                    <Button
                                        dark
                                        variant="ghost"
                                        type="button"
                                        className="px-4 border-dashed border-2 border-white/20 whitespace-nowrap h-[52px]"
                                        onClick={() => document.getElementById('heroVideoUpload').click()}
                                    >
                                        <Video size={18} className="mr-2" />
                                        Upload File
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-white/40 mt-2 italic">* Provide a direct .mp4 link or upload a new video file.</p>
                        </div>

                        <Button
                            dark
                            type="submit"
                            className="w-full h-14 text-lg font-bold gap-2 mt-4"
                            disabled={saving}
                        >
                            <Save size={22} />
                            {uploading ? 'Uploading Media...' : saving ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </form>
                </Card>

                {/* Preview Concept */}
                <Card dark className="p-0 overflow-hidden relative group border-white/20">
                    {console.log("🎬 Rendering Video with URL:", formData.videoUrl)}
                    <video
                        key={formData.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        src={formData.videoUrl || 'https://res.cloudinary.com/dnpk9egyk/video/upload/v1739165314/zestify/videos/hero-background.mp4'}
                        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-100 transition-transform duration-700"
                        onError={(e) => {
                            console.error("Video load error, falling back");
                            e.target.src = 'https://res.cloudinary.com/dnpk9egyk/video/upload/v1739165314/zestify/videos/hero-background.mp4';
                        }}
                    />

                    <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center space-y-6">
                        <Badge variant="success" className="bg-white/10 text-white backdrop-blur-md border border-white/20">Live Preview</Badge>
                        <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-2xl tracking-tighter uppercase">{formData.title || 'Your Title Here'}</h2>
                        <p className="text-sm sm:text-xl text-white/80 font-medium max-w-md drop-shadow-lg">{formData.subtitle || 'Your subtitle description will appear here...'}</p>
                        <button className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-slate-900 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl text-xs sm:text-base">
                            {formData.buttonText || 'Button'}
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CMSHeroEditor;
