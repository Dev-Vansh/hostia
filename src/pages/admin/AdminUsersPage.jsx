import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Edit, Trash2, Shield, User as UserIcon, Mail, Phone, Key, Search, X, Package } from 'lucide-react';
import { getAllUsers, createUser, updateUser, updateUserRole, deleteUser } from '@/api/users';
import { getAllOrders } from '@/api/admin';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/ui/alert-dialog";

const AdminUsersPage = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isUserOrdersModalOpen, setIsUserOrdersModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        discordId: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data.users || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch users',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            toast({
                title: 'Success',
                description: 'User created successfully'
            });
            setIsCreateModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to create user',
                variant: 'destructive'
            });
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }
            delete updateData.role;

            await updateUser(selectedUser.id, updateData);
            toast({
                title: 'Success',
                description: 'User updated successfully'
            });
            setIsEditModalOpen(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to update user',
                variant: 'destructive'
            });
        }
    };

    const handleDeleteUser = async () => {
        try {
            await deleteUser(selectedUser.id);
            toast({
                title: 'Success',
                description: 'User deleted successfully'
            });
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to delete user',
                variant: 'destructive'
            });
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await updateUserRole(userId, newRole);
            toast({
                title: 'Success',
                description: `User role updated to ${newRole}`
            });
            fetchUsers();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to update role',
                variant: 'destructive'
            });
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            discordId: user.discordId || '',
            password: '',
            role: user.role
        });
        setIsEditModalOpen(true);
    };

    const openDeleteDialog = (user) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const openUserOrdersModal = async (user) => {
        setSelectedUser(user);
        setIsUserOrdersModalOpen(true);
        setLoadingOrders(true);
        try {
            const orders = await getAllOrders();
            // Filter orders for this specific user and exclude expired
            const filteredOrders = orders.filter(order =>
                order.userId === user.id && order.status !== 'expired'
            );
            setUserOrders(filteredOrders);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch user orders',
                variant: 'destructive'
            });
        } finally {
            setLoadingOrders(false);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            discordId: '',
            password: '',
            role: 'user'
        });
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm)
    );

    return (
        <>
            <Helmet>
                <title>User Management - Admin Panel</title>
            </Helmet>

            <div className="min-h-screen bg-[#000000] text-white p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent mb-2">
                                User Management
                            </h1>
                            <p className="text-gray-400">Manage all users and their roles</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 flex items-center gap-2"
                        >
                            <UserPlus size={20} />
                            Add User
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users by name, email or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                {searchTerm ? 'No users found matching your search' : 'No users yet'}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5 border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Contact</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Orders</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Created</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                            <UserIcon size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{user.fullName}</div>
                                                            <div className="text-sm text-gray-400">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">
                                                        <div className="text-gray-300">{user.phoneNumber}</div>
                                                        {user.discordId && (
                                                            <div className="text-gray-500">{user.discordId}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleRoleChange(user.id, user.role)}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${user.role === 'admin'
                                                            ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                                                            : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                                                            }`}
                                                    >
                                                        {user.role === 'admin' ? (
                                                            <><Shield size={12} className="inline mr-1" />Admin</>
                                                        ) : (
                                                            <><UserIcon size={12} className="inline mr-1" />User</>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => openUserOrdersModal(user)}
                                                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold hover:bg-purple-500/30 transition-colors cursor-pointer"
                                                    >
                                                        {user.orderCount || 0} orders
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteDialog(user)}
                                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-black/95 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Add a new user to the system
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Discord ID (Optional)</label>
                            <input
                                type="text"
                                value={formData.discordId}
                                onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <DialogFooter>
                            <button
                                type="button"
                                onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-colors"
                            >
                                Create User
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="bg-black/95 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Update user information
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Discord ID (Optional)</label>
                            <input
                                type="text"
                                value={formData.discordId}
                                onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Password (leave empty to keep current)</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <DialogFooter>
                            <button
                                type="button"
                                onClick={() => { setIsEditModalOpen(false); resetForm(); }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-colors"
                            >
                                Update User
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-black/95 border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This will permanently delete the user <span className="text-white font-semibold">{selectedUser?.fullName}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/10 hover:bg-white/20 border-white/10">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* User Orders Modal */}
            <Dialog open={isUserOrdersModalOpen} onOpenChange={setIsUserOrdersModalOpen}>
                <DialogContent className="bg-black/95 border-white/10 text-white max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Orders for {selectedUser?.fullName}</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            View all active and pending orders (expired orders hidden)
                        </DialogDescription>
                    </DialogHeader>

                    {/* Status Filter */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setOrderStatusFilter('all')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${orderStatusFilter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setOrderStatusFilter('active')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${orderStatusFilter === 'active'
                                ? 'bg-green-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setOrderStatusFilter('pending')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${orderStatusFilter === 'pending'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            Pending Payment
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loadingOrders ? (
                            <div className="p-8 text-center text-gray-400">Loading orders...</div>
                        ) : userOrders.filter(order => {
                            if (orderStatusFilter === 'all') return true;
                            if (orderStatusFilter === 'active') return order.status === 'active';
                            if (orderStatusFilter === 'pending') return order.status === 'pending_upload' || order.status === 'payment_uploaded';
                            return true;
                        }).length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                No {orderStatusFilter !== 'all' ? orderStatusFilter : ''} orders found
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {userOrders.filter(order => {
                                    if (orderStatusFilter === 'all') return true;
                                    if (orderStatusFilter === 'active') return order.status === 'active';
                                    if (orderStatusFilter === 'pending') return order.status === 'pending_upload' || order.status === 'payment_uploaded';
                                    return true;
                                }).map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                    <Package size={20} className="text-purple-300" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">Order #{order.id}</h4>
                                                    <p className="text-sm text-gray-400">
                                                        {order.planName || `Plan ID: ${order.planId}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-green-400">₹{order.finalPrice}</div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold mt-1 inline-block ${order.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                                    order.status === 'pending_upload' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        order.status === 'payment_uploaded' ? 'bg-blue-500/20 text-blue-300' :
                                                            order.status === 'completed' ? 'bg-purple-500/20 text-purple-300' :
                                                                'bg-gray-500/20 text-gray-300'
                                                    }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <button
                            onClick={() => setIsUserOrdersModalOpen(false)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminUsersPage;

