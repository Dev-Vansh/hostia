import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getActiveOrders, getExpiredOrders, clearExpiredOrders } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const AdminManagerPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'expired'
    const [activeOrders, setActiveOrders] = useState([]);
    const [expiredOrders, setExpiredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const [active, expired] = await Promise.all([
                getActiveOrders(),
                getExpiredOrders()
            ]);
            setActiveOrders(active);
            setExpiredOrders(expired);
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

    const handleClearExpired = async () => {
        if (!window.confirm('Are you sure you want to clear all expired orders? This will mark them as expired.')) {
            return;
        }

        try {
            setClearing(true);
            const result = await clearExpiredOrders();
            toast({
                title: 'Success',
                description: `Cleared ${result.count} expired order(s)`,
            });
            loadOrders();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to clear expired orders',
                variant: 'destructive'
            });
        } finally {
            setClearing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Order Manager - Admin - HOSTIA</title>
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
                            Order Manager
                        </h1>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'active'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            Active Orders ({activeOrders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('expired')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'expired'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            Expired Orders ({expiredOrders.length})
                        </button>
                        {activeTab === 'expired' && expiredOrders.length > 0 && (
                            <button
                                onClick={handleClearExpired}
                                disabled={clearing}
                                className="ml-auto px-6 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                {clearing ? 'Clearing...' : 'Clear Expired'}
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading orders...</div>
                    ) : (
                        <>
                            {/* Active Orders Tab */}
                            {activeTab === 'active' && (
                                <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5">
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Order ID</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Customer</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Plan</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Type</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Order Date</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Renewal Date</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Amount</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activeOrders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="py-8 px-6 text-center text-gray-400">
                                                            No active orders found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    activeOrders.map((order) => (
                                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                                                            <td className="py-4 px-6 text-white">#{order.id}</td>
                                                            <td className="py-4 px-6">
                                                                <div className="text-white">{order.customer}</div>
                                                                <div className="text-gray-400 text-xs">{order.customerEmail}</div>
                                                            </td>
                                                            <td className="py-4 px-6 text-white">{order.plan}</td>
                                                            <td className="py-4 px-6">
                                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs uppercase">
                                                                    {order.planType}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6 text-gray-300">
                                                                {new Date(order.orderDate).toLocaleDateString()}
                                                            </td>
                                                            <td className="py-4 px-6 text-gray-300">
                                                                {order.renewalDate ? new Date(order.renewalDate).toLocaleDateString() : 'N/A'}
                                                            </td>
                                                            <td className="py-4 px-6 text-white font-semibold">₹{order.amount}</td>
                                                            <td className="py-4 px-6">
                                                                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Expired Orders Tab */}
                            {activeTab === 'expired' && (
                                <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5">
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Order ID</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Customer</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Plan</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Type</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Expired Date</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Days Since Expiry</th>
                                                    <th className="py-4 px-6 text-gray-400 font-semibold">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expiredOrders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="py-8 px-6 text-center text-gray-400">
                                                            No expired orders found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    expiredOrders.map((order) => (
                                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                                                            <td className="py-4 px-6 text-white">#{order.id}</td>
                                                            <td className="py-4 px-6">
                                                                <div className="text-white">{order.customer}</div>
                                                                <div className="text-gray-400 text-xs">{order.customerEmail}</div>
                                                            </td>
                                                            <td className="py-4 px-6 text-white">{order.plan}</td>
                                                            <td className="py-4 px-6">
                                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs uppercase">
                                                                    {order.planType}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6 text-red-300">
                                                                {new Date(order.expiredDate).toLocaleDateString()}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs font-semibold">
                                                                    {order.daysSinceExpiry} days
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6 text-white font-semibold">₹{order.amount}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminManagerPage;
