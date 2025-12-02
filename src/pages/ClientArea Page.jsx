import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getStoredUser, logout } from '@/api/auth';
import { getUserOrders, cancelOrder } from '@/api/orders';
import { useToast } from '@/hooks/use-toast';
import { User, Package, LogOut, Server, Calendar, Copy, Trash2, Upload, AlertCircle, Eye, EyeOff } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';

const ClientAreaPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
        loadOrders(storedUser.id);
    }, []);

    const loadOrders = async (userId) => {
        try {
            const ordersData = await getUserOrders(userId);
            setOrders(ordersData);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load orders',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
        setShowPassword(false);
    };

    const handleCancelOrder = (orderId) => {
        setOrderToCancel(orderId);
        setShowCancelModal(true);
        setShowDetailsModal(false);
    };

    const confirmCancelOrder = async () => {
        try {
            await cancelOrder(orderToCancel);
            toast({
                title: 'Order Cancelled',
                description: 'Your order has been cancelled successfully',
                variant: 'default'
            });
            setShowCancelModal(false);
            setOrderToCancel(null);
            loadOrders(user.id);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to cancel order',
                variant: 'destructive'
            });
        }
    };

    const handleLogout = () => {
        logout();
        window.dispatchEvent(new Event('auth-change'));
        navigate('/login');
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: `${label} copied to clipboard`,
            variant: 'default'
        });
    };

    return (
        <>
            <Helmet>
                <title>Client Panel - HOSTIA</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen px-4 pt-24 pb-12">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="mb-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
                                Client Panel
                            </h1>
                        </div>
                        <p className="text-gray-400">Welcome back, {user?.fullName}!</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                <User size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
                                <p className="text-gray-400">{user?.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-gray-400 text-sm mb-1">Phone Number</p>
                                <p className="text-white font-medium">{user?.phoneNumber}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4">
                                <p className="text-gray-400 text-sm mb-1">Discord ID</p>
                                <p className="text-white font-medium">{user?.discordId || 'Not provided'}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Package size={28} />
                                My Services
                            </h2>
                            <button
                                onClick={() => navigate('/services')}
                                className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-medium"
                            >
                                Order New Service
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Loading orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                                <h3 className="text-xl font-semibold text-white mb-2">No Active Services</h3>
                                <p className="text-gray-400 mb-6">You haven't purchased any hosting plans yet.</p>
                                <button
                                    onClick={() => navigate('/services')}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
                                >
                                    Browse Plans
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {orders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        onClick={() => handleOrderClick(order)}
                                        className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 transition-all group"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                                    <Server size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">
                                                        {order.planName}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span>₹{order.finalPrice}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                                <OrderStatusBadge status={order.status} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="bg-black border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Server className="text-blue-400" />
                            Service Details
                        </DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Plan</p>
                                    <p className="text-white font-semibold">{selectedOrder.planName}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Status</p>
                                    <div className="mt-1"><OrderStatusBadge status={selectedOrder.status} /></div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Price</p>
                                    <p className="text-white font-semibold">₹{selectedOrder.finalPrice}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Order Date</p>
                                    <p className="text-white font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {selectedOrder.status === 'active' && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-300 mb-4">VPS Access Details</h3>

                                    <div className="grid gap-4">
                                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-400">IP Address</p>
                                                <p className="text-white font-mono select-all">{selectedOrder.vpsDetails?.ipAddress || 'Pending'}</p>
                                            </div>
                                            {selectedOrder.vpsDetails?.ipAddress && (
                                                <button onClick={() => copyToClipboard(selectedOrder.vpsDetails.ipAddress, 'IP Address')} className="text-gray-400 hover:text-white">
                                                    <Copy size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-400">Username</p>
                                                <p className="text-white font-mono select-all">{selectedOrder.vpsDetails?.username || 'root'}</p>
                                            </div>
                                            {selectedOrder.vpsDetails?.username && (
                                                <button onClick={() => copyToClipboard(selectedOrder.vpsDetails.username, 'Username')} className="text-gray-400 hover:text-white">
                                                    <Copy size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg group">
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-400">Password</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-mono select-all">
                                                        {showPassword ? (selectedOrder.vpsDetails?.password || '••••••••') : '••••••••'}
                                                    </p>
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                            {selectedOrder.vpsDetails?.password && (
                                                <button
                                                    onClick={() => copyToClipboard(selectedOrder.vpsDetails.password, 'Password')}
                                                    className="text-gray-400 hover:text-white"
                                                    title="Copy password"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {selectedOrder.vpsDetails?.panelLink && (
                                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg">
                                                <div>
                                                    <p className="text-xs text-gray-400">Control Panel</p>
                                                    <a href={selectedOrder.vpsDetails.panelLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                                                        Open Panel
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {selectedOrder.notes && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-sm text-gray-400 mb-1">Admin Notes:</p>
                                            <p className="text-white text-sm">{selectedOrder.notes}</p>
                                        </div>
                                    )}

                                    <div className="mt-6 pt-4 border-t border-white/10">
                                        <a
                                            href="https://discord.gg/hffnxzNwhG" // Replace with actual link if known, or keep generic
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20.317 4.3698C18.798 3.6698 17.168 3.1698 15.447 3.0498C15.447 3.0498 15.178 3.5298 14.988 3.9698C13.088 3.6998 11.198 3.6998 9.318 3.9698C9.128 3.5298 8.858 3.0498 8.858 3.0498C7.138 3.1698 5.508 3.6698 3.988 4.3698C0.918 8.9898 0.078 13.5298 0.488 17.9998C2.528 19.5198 4.498 20.4398 6.428 21.0298C6.908 20.3798 7.338 19.6898 7.708 18.9698C6.998 18.7098 6.328 18.3798 5.698 17.9998C5.868 17.8798 6.038 17.7498 6.198 17.6098C10.028 19.3798 14.288 19.3798 18.088 17.6098C18.258 17.7498 18.428 17.8798 18.598 17.9998C17.968 18.3798 17.298 18.7098 16.588 18.9698C16.958 19.6898 17.388 20.3798 17.868 21.0298C19.798 20.4398 21.768 19.5198 23.808 17.9998C24.318 12.8798 22.988 8.3798 20.317 4.3698ZM8.018 15.3298C6.838 15.3298 5.878 14.2498 5.878 12.9298C5.878 11.6098 6.818 10.5298 8.018 10.5298C9.218 10.5298 10.178 11.6098 10.168 12.9298C10.168 14.2498 9.218 15.3298 8.018 15.3298ZM16.298 15.3298C15.118 15.3298 14.158 14.2498 14.158 12.9298C14.158 11.6098 15.098 10.5298 16.298 10.5298C17.498 10.5298 18.458 11.6098 18.448 12.9298C18.448 14.2498 17.498 15.3298 16.298 15.3298Z" fill="white" />
                                            </svg>
                                            Join Discord for Support
                                        </a>
                                    </div>
                                </div>
                            )}

                            {selectedOrder.status === 'rejected' && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="text-red-400 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="text-red-400 font-semibold mb-1">Order Rejected</h4>
                                            <p className="text-gray-300 text-sm">
                                                Reason: {selectedOrder.rejectionReason || 'Payment verification failed or invalid screenshot.'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCancelOrder(selectedOrder.id)}
                                        className="mt-4 w-full py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete Order
                                    </button>
                                </div>
                            )}

                            {selectedOrder.status === 'pending_upload' && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                    <div className="flex items-start gap-3 mb-4">
                                        <Upload className="text-yellow-400 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="text-yellow-400 font-semibold mb-1">Payment Proof Required</h4>
                                            <p className="text-gray-300 text-sm">
                                                Please upload a screenshot of your payment to complete this order.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                navigate(`/order/${selectedOrder.planId}?orderId=${selectedOrder.id}`);
                                            }}
                                            className="flex-1 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Upload size={16} />
                                            Upload Payment
                                        </button>
                                        <button
                                            onClick={() => handleCancelOrder(selectedOrder.id)}
                                            className="flex-1 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={16} />
                                            Cancel Order
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedOrder.status === 'pending' && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                    <div className="flex items-start gap-3 mb-4">
                                        <Upload className="text-yellow-400 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="text-yellow-400 font-semibold mb-1">Order Pending</h4>
                                            <p className="text-gray-300 text-sm">
                                                Your order is waiting for payment. You can cancel if you no longer need this service.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/order/${selectedOrder.planId}?orderId=${selectedOrder.id}`)}
                                            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                                        >
                                            Upload Payment
                                        </button>
                                        <button
                                            onClick={() => handleCancelOrder(selectedOrder.id)}
                                            className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent className="bg-black border border-white/10 text-white max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Cancel Order?</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-300">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setShowCancelModal(false)}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={confirmCancelOrder}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                            Yes, Cancel
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClientAreaPage;
