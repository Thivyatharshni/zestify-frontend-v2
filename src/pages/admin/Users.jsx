import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Users as UsersIcon,
    Trash2,
    Search,
    UserCheck,
    UserX,
} from 'lucide-react';
import {
    Table,
    Badge,
    Modal,
    Loader,
    EmptyState,
    cn,
    Button
} from '../../components/ui/DashboardUI';
import { adminService } from '../../services/dashboard/adminService';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const location = useLocation();
    const highlightId = location.state?.highlightId;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUsers();
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (id) => {
        try {
            const response = await adminService.blockUser(id);
            if (response.data.success) {
                toast.success('User status updated');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await adminService.deleteUser(selectedUser._id);
            if (response.data.success) {
                toast.success('User deleted permanently');
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
                fetchUsers();
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeUsers = users.filter(u => !u.isBlocked).length;
    const blockedUsers = users.filter(u => u.isBlocked).length;

    if (loading) return <Loader dark />;

    return (
        <div className="space-y-8 pb-10">
            {/* Glass Header with Stats */}
            <div className="relative overflow-hidden bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                            <UsersIcon className="text-white" size={28} />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">User Management</h1>
                    </div>
                    <p className="text-white/70 font-medium mb-6">Monitor and manage customer accounts</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Users</p>
                                    <h3 className="text-3xl font-black text-white">{users.length}</h3>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                                    <UsersIcon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Active</p>
                                    <h3 className="text-3xl font-black text-white">{activeUsers}</h3>
                                </div>
                                <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <UserCheck className="text-emerald-300" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all cursor-pointer group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Blocked</p>
                                    <h3 className="text-3xl font-black text-white">{blockedUsers}</h3>
                                </div>
                                <div className="p-3 bg-red-500/20 rounded-xl group-hover:scale-110 transition-transform">
                                    <UserX className="text-red-300" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glass Search Bar */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all shadow-xl rounded-[2rem] p-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors" size={22} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:bg-white/10 focus:border-white/30 focus:ring-4 focus:ring-white/10 transition-all text-base font-bold text-white placeholder:text-white/40 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredUsers.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <Table headers={['User', 'Email', 'Phone', 'Status', 'Actions']} dark>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user._id}
                                className={cn(
                                    "hover:bg-white/5 transition-all group border-b border-white/5 last:border-0",
                                    highlightId === user._id && "bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-500/30 scale-[1.01] z-10 relative"
                                )}
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform backdrop-blur-md">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-base font-black text-white">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-white/80">{user.email}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-semibold text-white/80">+{user.phone}</span>
                                </td>
                                <td className="px-6 py-5">
                                    {user.isBlocked ? (
                                        <Badge variant="danger" dark className="shadow-sm shadow-red-500/10">Blocked</Badge>
                                    ) : (
                                        <Badge variant="success" dark className="shadow-sm shadow-emerald-500/10">Active</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleBlock(user._id)}
                                            className={cn(
                                                'px-3 py-2 rounded-xl transition-all font-semibold text-xs border backdrop-blur-sm',
                                                user.isBlocked
                                                    ? 'bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 border-emerald-500/30'
                                                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                                            )}
                                            title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                        >
                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                        <button
                                            onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                            className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-all border border-red-500/30 backdrop-blur-sm"
                                            title="Delete User"
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
                    <EmptyState title="No Users Found" message="Try adjusting your search criteria." icon={UsersIcon} dark />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete User Account"
                dark
                footer={(
                    <>
                        <Button variant="ghost" dark onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="danger" dark onClick={handleDelete}>Permanently Delete</Button>
                    </>
                )}
            >
                <div className="text-center py-4">
                    <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/10 border border-white/10 backdrop-blur-sm">
                        <Trash2 size={36} />
                    </div>
                    <p className="text-white/80 font-medium text-lg">
                        Are you sure you want to permanently delete <span className="font-black text-white">"{selectedUser?.name}"</span>?
                    </p>
                    <p className="text-sm text-white/50 mt-2">
                        This action cannot be undone and will remove all user data.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;
