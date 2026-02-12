import React from 'react';
import { List, Plus, Trash2, Save, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import {
    Card,
    Button,
    Input,
    Loader,
    Badge,
    Modal,
    cn
} from '../../components/ui/DashboardUI';
import { cmsApi } from '../../services/dashboard/cmsApi';
import toast from 'react-hot-toast';

const DEFAULT_FOOTER = {
    'Company': [
        { label: "About", url: "/about", content: "Zestify is a premium food delivery service connecting foodies with the best restaurants in town. Founded in 2024, our mission is to deliver happiness in every bite." },
        { label: "Careers", url: "/careers", content: "Join our team! We are looking for passionate individuals to help us revolutionize the food delivery industry. Check back later for open positions." },
        { label: "Team", url: "/team", content: "Meet the team behind Zestify. A group of food lovers and tech enthusiasts working together." },
    ],
    'Contact': [
        { label: "Help & Support", url: "/help", content: "Need help? Contact our support team at support@zestify.com or call us at 1-800-ZESTIFY." },
        { label: "Partner with us", url: "/partner", content: "Grow your business with Zestify. Reach more customers and increase your sales." },
        { label: "Ride with us", url: "/ride", content: "Become a delivery partner and earn with every delivery. Flexible hours and great pay." },
    ],
    'Legal': [
        { label: "Terms & Conditions", url: "/terms", content: "By using Zestify, you agree to our terms of service. Please read them carefully." },
        { label: "Refund & Cancellation", url: "/refund", content: "We genuinely understand that sometimes things go wrong. Read our policy on refunds and cancellations." },
        { label: "Privacy Policy", url: "/privacy", content: "Your privacy is important to us. Learn how we handle your data." },
        { label: "Cookie Policy", url: "/cookie", content: "We use cookies to improve your experience. Learn more about our cookie usage." },
    ]
};

const CMSFooterEditor = () => {
    console.log("CMSFooterEditor rendering...");
    const [sections, setSections] = React.useState({
        'Company': [],
        'Contact': [],
        'Legal': []
    });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const isSeeding = React.useRef(false);

    const [isContentModalOpen, setIsContentModalOpen] = React.useState(false);
    const [editingContent, setEditingContent] = React.useState({
        section: '',
        index: -1,
        content: ''
    });

    React.useEffect(() => {
        console.log("CMSFooterEditor mounted, fetching...");
        fetchFooter();
    }, []);

    const openContentModal = (section, index, content) => {
        setEditingContent({ section, index, content: content || '' });
        setIsContentModalOpen(true);
    };

    const handleSaveContent = () => {
        const { section, index, content } = editingContent;
        handleLinkChange(section, index, 'content', content);
        setIsContentModalOpen(false);
    };

    const handleSyncDefaults = async () => {
        try {
            setLoading(true);
            isSeeding.current = true;
            toast.loading('Syncing with site defaults...');

            for (const [section, links] of Object.entries(DEFAULT_FOOTER)) {
                await cmsApi.updateFooter({
                    section,
                    links: links.map((l, i) => ({ ...l, order: i }))
                });
            }

            await fetchFooter();
            toast.dismiss();
            toast.success('Synced successfully!');
        } catch (error) {
            toast.dismiss();
            toast.error('Sync failed');
        } finally {
            isSeeding.current = false;
            setLoading(false);
        }
    };

    const fetchFooter = async () => {
        if (isSeeding.current) return;
        try {
            setLoading(true);
            const response = await cmsApi.getFooter();

            if (response.data.success && response.data.data.length > 0) {
                // Check if we need to "Smart Seed" missing content
                const items = response.data.data;
                const needsContent = items.some(item => !item.content);

                if (needsContent) {
                    console.log("Missing content detected, performing Smart Sync...");
                    toast.loading('Upgrading content from defaults...');

                    // Group current data to preserve labels/urls but add content
                    const grouped = items.reduce((acc, item) => {
                        if (!acc[item.section]) acc[item.section] = [];

                        // Find default content if missing
                        let content = item.content;
                        if (!content) {
                            const defaultItem = DEFAULT_FOOTER[item.section]?.find(d => d.url === item.url);
                            content = defaultItem?.content || '';
                        }

                        acc[item.section].push({ ...item, content });
                        return acc;
                    }, {});

                    for (const section of Object.keys(grouped)) {
                        await cmsApi.updateFooter({ section, links: grouped[section] });
                    }

                    toast.dismiss();
                    toast.success('Content upgraded!');
                    // Re-fetch to get the final updated state
                    const refresh = await cmsApi.getFooter();
                    const finalGrouped = refresh.data.data.reduce((acc, it) => {
                        if (!acc[it.section]) acc[it.section] = [];
                        acc[it.section].push(it);
                        return acc;
                    }, { 'Company': [], 'Contact': [], 'Legal': [] });
                    setSections(finalGrouped);
                } else {
                    const grouped = items.reduce((acc, item) => {
                        if (!acc[item.section]) acc[item.section] = [];
                        acc[item.section].push(item);
                        return acc;
                    }, { 'Company': [], 'Contact': [], 'Legal': [] });

                    Object.keys(grouped).forEach(key => {
                        grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0));
                    });

                    setSections(grouped);
                }
            } else if (!isSeeding.current) {
                // ... same auto-seed logic as before but calling the new helper
                await handleSyncDefaults();
            }
        } catch (error) {
            isSeeding.current = false;
            toast.dismiss();
            toast.error('Failed to load footer data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = (section) => {
        setSections(prev => ({
            ...prev,
            [section]: [
                ...prev[section],
                { label: '', url: '', order: prev[section].length }
            ]
        }));
    };

    const handleRemoveLink = (section, index) => {
        setSections(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleLinkChange = (section, index, field, value) => {
        setSections(prev => ({
            ...prev,
            [section]: prev[section].map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    const saveSection = async (section) => {
        try {
            setSaving(true);
            const links = sections[section].filter(l => l.label && l.url);
            await cmsApi.updateFooter({ section, links });
            toast.success(`Footer section "${section}" saved!`);
        } catch (error) {
            toast.error(`Failed to save ${section}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                                <List className="text-white" size={28} />
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                                Footer CMS
                            </h1>
                        </div>
                        <Button
                            variant="secondary"
                            dark
                            size="sm"
                            className="rounded-xl sm:rounded-2xl gap-2 h-10 sm:h-12 text-xs sm:text-sm"
                            onClick={handleSyncDefaults}
                        >
                            <ShieldCheck size={16} /> Sync Defaults
                        </Button>
                    </div>
                    <p className="text-white/70 text-sm sm:text-base font-medium tracking-wide">Manage links and navigation in the website footer</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {Object.keys(sections).map((sectionName) => (
                    <Card key={sectionName} dark className="p-4 sm:p-8 group relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem]">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <ShieldCheck size={18} className="text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-wider">{sectionName}</h3>
                            </div>
                            <Badge variant="neutral" dark>{sections[sectionName].length} Links</Badge>
                        </div>

                        <div className="space-y-6 relative z-10 min-h-[300px]">
                            {sections[sectionName].map((link, idx) => (
                                <div key={idx} className="p-4 sm:p-6 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/5 space-y-4 hover:border-white/10 transition-all group/link">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Link #{idx + 1}</span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => openContentModal(sectionName, idx, link.content)}
                                                className={cn(
                                                    "p-2 rounded-xl transition-all",
                                                    link.content ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-white/10 text-white/30 hover:text-white"
                                                )}
                                                title="Edit Page Content"
                                            >
                                                <FileText size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveLink(sectionName, idx)}
                                                className="p-2 hover:bg-red-500/20 text-white/30 hover:text-red-400 rounded-xl transition-all"
                                                title="Remove Link"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <Input
                                        placeholder="Label (e.g. About Us)"
                                        value={link.label}
                                        onChange={(e) => handleLinkChange(sectionName, idx, 'label', e.target.value)}
                                        dark
                                        className="h-10 text-sm"
                                    />
                                    <Input
                                        placeholder="URL (e.g. /about)"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(sectionName, idx, 'url', e.target.value)}
                                        dark
                                        className="h-10 text-sm"
                                    />
                                </div>
                            ))}

                            {sections[sectionName].length === 0 && (
                                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 rounded-3xl opacity-30">
                                    <ExternalLink size={32} />
                                    <p className="mt-2 text-sm font-bold">No custom links</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 flex gap-4 relative z-10">
                            <Button
                                variant="ghost"
                                dark
                                className="flex-1 rounded-2xl border border-white/5"
                                onClick={() => handleAddLink(sectionName)}
                            >
                                <Plus size={18} className="mr-2" /> Link
                            </Button>
                            <Button
                                dark
                                className="flex-1 rounded-2xl shadow-xl shadow-white/5"
                                onClick={() => saveSection(sectionName)}
                                disabled={saving}
                            >
                                <Save size={18} className="mr-2" /> {saving ? '...' : 'Save'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl flex items-start gap-4">
                <div className="p-2 bg-orange-500/20 rounded-xl text-orange-400">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1">Live Synchronization</h4>
                    <p className="text-white/60 text-sm">Saving a section will instantly update the footer across the entire application. Leave a section empty to revert to landing page defaults.</p>
                </div>
            </div>

            {/* Content Editor Modal */}
            <Modal
                isOpen={isContentModalOpen}
                onClose={() => setIsContentModalOpen(false)}
                title={`Page Content: ${sections[editingContent.section]?.[editingContent.index]?.label || '...'}`}
                dark
                size="lg"
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsContentModalOpen(false)}>Cancel</Button>
                        <Button dark onClick={handleSaveContent}>Apply Content</Button>
                    </>
                )}
            >
                <div className="space-y-4">
                    <p className="text-xs text-white/50 font-medium">This content will be displayed on the static page linked by this footer item.</p>
                    <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium resize-none focus:ring-4 focus:ring-white/10 outline-none transition-all h-[400px]"
                        placeholder="Type page content here..."
                        value={editingContent.content}
                        onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default CMSFooterEditor;
