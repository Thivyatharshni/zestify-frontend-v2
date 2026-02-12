import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Utensils,
    Bike,
    Users,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X,
    ChevronRight,
    Bell,

    User as UserIcon,
    ShoppingBag,
    TrendingUp,
    History,
    Wallet,
    Shield,
    Zap,
    Layout,
    Layers,
    Type,
    Sparkles,
    LayoutGrid,
    ListChecks
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { cn, Modal, Input, Button } from '../components/ui/DashboardUI';
import { adminService } from '../services/dashboard/adminService';

const DashboardLayout = ({ role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState(
        JSON.parse(localStorage.getItem('readNotifications') || '[]')
    );
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (role === 'super_admin') {
            fetchNotifications();
        }
    }, [role]);

    useEffect(() => {
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    }, [readNotifications]);

    const fetchNotifications = async () => {
        try {
            const response = await adminService.getNotifications();
            if (response.data.success) {
                // Filter out notifications that have already been read/dismissed
                const filtered = response.data.data.filter(n => !readNotifications.includes(n.id));
                setNotifications(filtered);
            }
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userLocation'); // Also clear location
        navigate('/login');
    };

    const handleNotificationClick = (notif) => {
        setIsNotificationsOpen(false);

        // Mark as read immediately on click
        setReadNotifications(prev => [...new Set([...prev, notif.id])]);
        setNotifications(prev => prev.filter(n => n.id !== notif.id));

        const navigationState = { state: { highlightId: notif.id } };

        switch (notif.type) {
            case 'order':
                navigate('/admin/orders', navigationState);
                break;
            case 'restaurant':
                navigate('/admin/restaurants', navigationState);
                break;
            case 'user':
                navigate('/admin/users', navigationState);
                break;
            case 'delivery_partner':
                navigate('/admin/delivery', navigationState);
                break;
            default:
                break;
        }
    };

    const handleMarkAllRead = () => {
        const currentIds = notifications.map(n => n.id);
        setReadNotifications(prev => [...new Set([...prev, ...currentIds])]);
        setNotifications([]);
        toast.success('All notifications marked as read');
    };

    const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

    // ... (menuItems definition remains same)

    const menuItems = {
        super_admin: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Restaurants', path: '/admin/restaurants', icon: Utensils },
            { name: 'Delivery Partners', path: '/admin/delivery', icon: Bike },
            { name: 'Global Orders', path: '/admin/orders', icon: ShoppingBag },
            {
                section: 'CMS',
                items: [
                    { name: 'Hero Section', path: '/admin/cms/hero', icon: Sparkles },
                    { name: 'Categories', path: '/admin/cms/categories', icon: LayoutGrid },
                    { name: 'Food Lanes', path: '/admin/cms/lanes', icon: Layers },
                    { name: 'Promotions', path: '/admin/cms/offers', icon: Zap },
                    { name: 'Footer Links', path: '/admin/cms/footer', icon: ListChecks },
                ]
            }
        ],
        restaurant_admin: [
            { name: 'Overview', path: '/restaurant/dashboard', icon: LayoutDashboard },
            { name: 'Menu Items', path: '/restaurant/menu', icon: Utensils },
            { name: 'Orders', path: '/restaurant/orders', icon: ShoppingBag },
            { name: 'Analytics', path: '/restaurant/stats', icon: TrendingUp },
            { name: 'Shop Profile', path: '/restaurant/profile', icon: Settings },
        ],
        delivery_partner: [
            { name: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard },
            { name: 'Active Orders', path: '/delivery/orders', icon: Bike },
            { name: 'Earnings', path: '/delivery/earnings', icon: Wallet },
            { name: 'Trip History', path: '/delivery/history', icon: History },
            { name: 'Profile', path: '/delivery/profile', icon: UserIcon },
        ],
    };

    const currentMenuItems = menuItems[role] || [];
    const isSuperAdmin = role === 'super_admin';

    // GLASSMORPHISM THEME CONSTANTS - PROFESSIONAL (Applied to all roles)
    const sidebarBg = 'bg-white/5 backdrop-blur-xl border-white/10';

    // Professional Gradient (Deep Slate/Blue)
    const mainBg = 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950';

    const contentBg = 'bg-transparent';

    const brandColor = 'text-white drop-shadow-md';

    // Glass active item 
    const activeItemBg = 'bg-white/10 backdrop-blur-md shadow-lg border border-white/5';

    const hoverBg = 'hover:bg-white/5';

    // Glass header
    const headerBg = 'bg-white/5 backdrop-blur-xl border-white/10 shadow-sm';

    const headerText = 'text-white';
    const subText = 'text-slate-300';

    return (
        <div className={cn("min-h-screen flex font-sans", mainBg)}>
            <Toaster position="top-right" />

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:flex flex-col transition-all duration-300 ease-in-out border-r relative z-20",
                    sidebarBg,
                    isSuperAdmin ? "text-white" : "text-white",
                    isSidebarOpen ? "w-72" : "w-24"
                )}
            >
                <div className={cn("p-6 flex items-center justify-between mb-4 relative z-10")}>
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3">
                            {isSuperAdmin && (
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                                    <Shield className="text-white" size={20} />
                                </div>
                            )}
                            <h1 className={cn("text-2xl font-black tracking-tighter uppercase", brandColor)}>
                                {isSuperAdmin ? 'Admin' : 'Zestify'}
                            </h1>
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-lg mx-auto bg-white/10 border border-white/10 backdrop-blur-md text-white">
                            {isSuperAdmin ? <Shield size={24} /> : (role === 'restaurant_admin' ? <Utensils size={24} /> : <Bike size={24} />)}
                        </div>
                    )}

                    {isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={cn("p-2 rounded-lg transition-colors", hoverBg)}
                        >
                            <X size={20} className="text-white/80" />
                        </button>
                    )}
                </div>

                {!isSidebarOpen && (
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={cn("p-2 rounded-lg transition-colors", hoverBg)}
                        >
                            <MenuIcon size={24} className="text-white/80" />
                        </button>
                    </div>
                )}

                <nav className="flex-1 px-4 space-y-3 relative z-10">
                    {currentMenuItems.map((item, idx) => {
                        if (item.section) {
                            return (
                                <div key={idx} className="pt-4 pb-2">
                                    {isSidebarOpen && (
                                        <p className="px-5 mb-2 text-xs font-black uppercase tracking-widest text-slate-500 transition-opacity">
                                            {item.section}
                                        </p>
                                    )}
                                    <div className="space-y-1">
                                        {item.items.map((subItem) => (
                                            <NavLink
                                                key={subItem.path}
                                                to={subItem.path}
                                                className={({ isActive }) => cn(
                                                    "flex items-center gap-5 px-5 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                                                    isActive
                                                        ? cn(activeItemBg, "text-white font-bold")
                                                        : cn("text-slate-300 hover:text-white", hoverBg)
                                                )}
                                            >
                                                <subItem.icon size={isSidebarOpen ? 22 : 26} className={cn("flex-shrink-0 transition-transform group-hover:scale-110", !isSidebarOpen && "mx-auto")} />
                                                {isSidebarOpen && <span className="text-[15px]">{subItem.name}</span>}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-5 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden",
                                    isActive
                                        ? cn(activeItemBg, "text-white font-bold")
                                        : cn("text-slate-300 hover:text-white", hoverBg)
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={26} className={cn("flex-shrink-0 transition-transform group-hover:scale-110", !isSidebarOpen && "mx-auto")} />
                                        {isSidebarOpen && <span className="text-lg">{item.name}</span>}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className={cn("p-4 relative z-10 border-t", isSuperAdmin ? "border-white/10" : "border-slate-800")}>
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 w-full px-4 py-3.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors",
                            !isSidebarOpen && "justify-center"
                        )}
                    >
                        <LogOut size={22} />
                        {isSidebarOpen && <span className="font-semibold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Navbar */}
                <header className={cn("h-20 flex items-center justify-between px-8 z-10 transition-all", headerBg)}>
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-white/80"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <MenuIcon size={24} />
                        </button>
                        <div className={cn("hidden sm:flex items-center gap-2 text-sm font-medium", subText)}>
                            <span className={cn("hover:text-white transition-colors cursor-pointer capitalize")}>
                                {role.replace('_', ' ')}
                            </span>
                            <ChevronRight size={14} className="opacity-50" />
                            <span className={cn("font-bold capitalize", headerText)}>
                                {location.pathname.split('/').pop().replace('-', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {isSuperAdmin && (
                            <div className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                                <Zap className="text-blue-400" size={20} fill="currentColor" />
                                <span className="text-sm font-bold text-white uppercase tracking-widest">Super Admin</span>
                            </div>
                        )}


                        <div
                            className="flex items-center gap-3 relative"
                            onMouseEnter={() => setIsNotificationsOpen(true)}
                            onMouseLeave={() => setIsNotificationsOpen(false)}
                        >
                            <button
                                className={cn(
                                    "p-2.5 rounded-full relative transition-all hover:scale-105 active:scale-95",
                                    isSuperAdmin ? "bg-white/5 text-white hover:bg-white/10 border border-white/10" : "text-slate-500 hover:bg-slate-100"
                                )}>
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full border-2 animate-pulse bg-blue-500 border-transparent"></span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute top-10 right-0 pt-4 z-50">
                                    <div className="w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                            <h4 className="font-bold text-white">Notifications</h4>
                                            <span onClick={handleMarkAllRead} className="text-xs text-blue-400 font-medium cursor-pointer hover:text-blue-300">Mark all read</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif, idx) => {
                                                    const Icon = notif.type === 'order' ? ShoppingBag : notif.type === 'user' ? Users : Utensils;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="p-4 hover:bg-white/5 border-b border-white/5 last:border-0 cursor-pointer flex gap-3 transition-colors group/notif"
                                                        >
                                                            <div className="mt-1" onClick={() => handleNotificationClick(notif)}><Icon size={16} className={notif.color || 'text-white'} /></div>
                                                            <div className="flex-1" onClick={() => handleNotificationClick(notif)}>
                                                                <p className="text-sm font-medium text-white">{notif.title}</p>
                                                                <p className="text-xs text-white/50">{notif.message}</p>
                                                                <p className="text-[10px] text-white/30 mt-1">
                                                                    {new Date(notif.time).toLocaleTimeString()} • {new Date(notif.time).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setReadNotifications(prev => [...new Set([...prev, notif.id])]);
                                                                    setNotifications(prev => prev.filter(n => n.id !== notif.id));
                                                                }}
                                                                className="opacity-0 group-hover/notif:opacity-100 p-1 hover:bg-white/10 rounded-lg transition-all text-white/30 hover:text-white self-start"
                                                                title="Dismiss"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-8 text-center text-white/50 text-sm">
                                                    No new notifications
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 bg-white/5 text-center">
                                            <span className="text-xs font-bold text-white/60 cursor-pointer hover:text-white">View All Updates</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            className="relative"
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                        >
                            <button
                                className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-tr from-blue-500/20 to-blue-600/20 text-white border border-white/20 backdrop-blur-md hover:bg-white/10"
                                )}>
                                <UserIcon size={24} />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute top-10 right-0 pt-4 z-50">
                                    <div className="w-80 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-6 text-center border-b border-white/5">
                                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg mb-4 border-4 border-white/10">
                                                {currentUser.role === 'super_admin' ? 'SA' : 'U'}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1">{currentUser.name || 'Admin'}</h3>
                                            <p className="text-sm text-blue-300 font-medium bg-blue-500/10 inline-block px-3 py-1 rounded-full border border-blue-500/20 capitalize">{currentUser.role?.replace('_', ' ') || 'User'}</p>
                                            <p className="text-sm text-white/50 mt-3 font-medium">{currentUser.email}</p>
                                        </div>
                                        <div className="p-3 space-y-2">
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    setIsEditProfileOpen(true);
                                                }}
                                                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-white/80 hover:bg-white/10 hover:text-white transition-all font-bold border border-transparent hover:border-white/10"
                                            >
                                                <Settings size={20} />
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all font-bold border border-transparent hover:border-red-500/20"
                                            >
                                                <LogOut size={20} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className={cn("flex-1 overflow-y-auto p-6 scrollbar-hide", contentBg)}>
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm">
                    <div className={cn("w-72 h-full p-6 shadow-2xl animate-in slide-in-from-left duration-300 border-r", sidebarBg, isSuperAdmin ? "border-white/10" : "border-slate-800")}>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className={cn("text-2xl font-black", brandColor)}>
                                {isSuperAdmin ? 'ADMIN' : 'ZESTIFY'}
                            </h1>
                            <button onClick={() => setIsMobileMenuOpen(false)} className={cn("p-2 rounded-lg text-white/70", hoverBg)}>
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="space-y-2">
                            {currentMenuItems.map((item, idx) => {
                                if (item.section) {
                                    return (
                                        <div key={idx} className="pt-4 pb-2">
                                            <p className="px-5 mb-2 text-xs font-black uppercase tracking-widest text-slate-500 transition-opacity">
                                                {item.section}
                                            </p>
                                            <div className="space-y-1">
                                                {item.items.map((subItem) => (
                                                    <NavLink
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={({ isActive }) => cn(
                                                            "flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all",
                                                            isActive ? cn(activeItemBg, "text-white") : cn("text-white/70", hoverBg)
                                                        )}
                                                    >
                                                        <subItem.icon size={22} />
                                                        {subItem.name}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => cn(
                                            "flex items-center gap-4 px-4 py-4 rounded-xl font-semibold transition-all",
                                            isActive ? cn(activeItemBg, "text-white") : cn("text-white/70", hoverBg)
                                        )}
                                    >
                                        <item.icon size={22} />
                                        {item.name}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                user={currentUser}
                handleLogout={handleLogout}
            />
        </div>
    );
};

// Sub-component for Edit Profile Modal
const EditProfileModal = ({ isOpen, onClose, user, handleLogout }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '',
        });
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const trimmedPassword = formData.password.trim();
            const payload = {
                name: formData.name,
                email: formData.email,
            };
            if (trimmedPassword) {
                payload.password = trimmedPassword;
            }

            const response = await adminService.updateProfile(payload);
            if (response.data.success) {
                toast.success('Profile updated successfully! Please login again.');
                onClose();
                handleLogout(); // Auto logout to force re-login with new creds
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Profile"
            dark={true}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    dark={true}
                    required
                />
                <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    dark={true}
                    required
                />
                <Input
                    label="New Password (Optional)"
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    dark={true}
                    minLength={6}
                />
                <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onClose} className="text-white/50 hover:text-white hover:bg-white/10">
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white">
                        {isLoading ? 'Updating...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default DashboardLayout;

