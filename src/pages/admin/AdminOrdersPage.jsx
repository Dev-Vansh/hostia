import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getAllOrders, verifyPayment, rejectPayment } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, X, Eye } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';

const AdminOrdersPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [vpsDetails, setVpsDetails] = useState({
        ip: '',
        username: '',
        password: '',
        panelLink: '',
        notes: '',
        renewalDate: ''
    });
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const ordersData = await getAllOrders();
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

    const handleVerify = async () => {
        try {
            setProcessing(true);
            await verifyPayment(selectedOrder.id, vpsDetails);

            toast({
                title: 'Success',
                description: 'Payment verified and order activated',
                variant: 'default'
            });

            setShowVerifyModal(false);
            setSelectedOrder(null);
            setVpsDetails({ ip: '', username: '', password: '', panelLink: '', notes: '', renewalDate: '' });
            loadOrders();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to verify payment',
                variant: 'destructive'
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        try {
            setProcessing(true);
            await rejectPayment(selectedOrder.id, rejectionReason);

            toast({
                title: 'Payment Rejected',
                description: 'Rejection notification sent to customer',
                variant: 'default'
            });

            setShowRejectModal(false);
            setSelectedOrder(null);
            setRejectionReason('');
            loadOrders();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to reject payment',
                variant: 'destructive'
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Orders - Admin - HOSTIA</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen px-4 py-12">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
                            Manage Orders
                        </h1>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading orders...</div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                                            <p className="text-gray-400">{order.userName} - {order.userEmail}</p>
                                            <p className="text-blue-400">{order.planName}</p>
                                        </div>
                                        <OrderStatusBadge status={order.status} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Amount</p>
                                            <p className="text-white font-semibold">₹{order.finalPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Promo Used</p>
                                            <p className="text-white">{order.promoCode || 'None'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Transaction ID</p>
                                            <p className="text-white text-sm">{order.transactionId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Order Date</p>
                                            <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {(order.status === 'payment_uploaded' || order.status === 'pending_upload') && (
                                        <div className="flex gap-3">
                                            {order.paymentScreenshot ? (
                                                <a
                                                    href={`http://localhost:5000/uploads/${order.paymentScreenshot}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                                                >
                                                    <Eye size={18} />
                                                    View Screenshot
                                                </a>
                                            ) : (
                                                <span className="px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg flex items-center gap-2">
                                                    Pending Upload
                                                </span>
                                            )}

                                            {order.status === 'payment_uploaded' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowVerifyModal(true);
                                                    }}
                                                    className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
                                                >
                                                    <Check size={18} />
                                                    Verify
                                                </button>
                                            )}

                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowRejectModal(true);
                                                }}
                                                className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                                            >
                                                <X size={18} />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Verify Modal */}
            <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
                <DialogContent className="bg-black border border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Verify Payment & Add VPS Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">IP Address</label>
                                <input
                                    type="text"
                                    value={vpsDetails.ip}
                                    onChange={(e) => setVpsDetails({ ...vpsDetails, ip: e.target.value })}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                    placeholder="192.168.1.1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={vpsDetails.username}
                                    onChange={(e) => setVpsDetails({ ...vpsDetails, username: e.target.value })}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                    placeholder="root"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Password</label>
                                <input
                                    type="text"
                                    value={vpsDetails.password}
                                    onChange={(e) => setVpsDetails({ ...vpsDetails, password: e.target.value })}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                    placeholder="********"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Panel Link</label>
                                <input
                                    type="url"
                                    value={vpsDetails.panelLink}
                                    onChange={(e) => setVpsDetails({ ...vpsDetails, panelLink: e.target.value })}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                    placeholder="https://panel.example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Renewal Date</label>
                            <input
                                type="date"
                                value={vpsDetails.renewalDate}
                                onChange={(e) => setVpsDetails({ ...vpsDetails, renewalDate: e.target.value })}
                                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Notes (Optional)</label>
                            <textarea
                                value={vpsDetails.notes}
                                onChange={(e) => setVpsDetails({ ...vpsDetails, notes: e.target.value })}
                                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                rows={3}
                                placeholder="Additional information for the customer"
                            />
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : 'Verify & Activate Order'}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="bg-black border border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Reject Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Rejection Reason *</label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                rows={4}
                                placeholder="Please provide a clear reason for rejection..."
                                required
                            />
                        </div>

                        <button
                            onClick={handleReject}
                            disabled={processing || !rejectionReason.trim()}
                            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : 'Reject Payment'}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminOrdersPage;
