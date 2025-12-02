import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getAnalytics } from '@/api/admin';
import { logout } from '@/api/auth';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { BarChart3, DollarSign, Package, Clock, Users, LogOut, FileText, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { data: analytics, loading, refetch, lastUpdated } = useRealtimeData(getAnalytics, 30000);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const StatCard = ({ icon: Icon, title, value, color, subtitle, subValue }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-black/50 backdrop-blur-xl border border-${color}-500/30 rounded-2xl p-6 hover:bg-white/5 transition-all relative overflow-hidden group`}
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className={`text-${color}-400`} />
                </div>
                {subValue && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-300`}>
                        {subValue}
                    </span>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
                <p className="text-3xl font-bold text-white">{value}</p>
                {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
            </div>
        </motion.div>
    );

    if (loading && !analytics) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <ParticleBackground />
                <div className="text-white text-xl flex items-center gap-3">
                    <RefreshCw className="animate-spin" />
                    Loading analytics...
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Admin Panel - HOSTIA</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen px-4 py-12 bg-black/90">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent mb-2">
                                Admin Panel
                            </h1>
                            <div className="flex items-center gap-3 text-gray-400 text-sm">
                                <p>Welcome to the control panel</p>
                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                <p className="flex items-center gap-1">
                                    <Clock size={12} />
                                    Updated: {lastUpdated?.toLocaleTimeString()}
                                </p>
                                <button
                                    onClick={refetch}
                                    className="hover:text-white transition-colors"
                                    title="Refresh Data"
                                >
                                    <RefreshCw size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2"
                            >
                                <FileText size={18} />
                                Orders
                            </button>
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
                            >
                                <Users size={18} />
                                Users
                            </button>
                            <button
                                onClick={() => navigate('/admin/categories')}
                                className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
                            >
                                <Package size={18} />
                                Categories
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Sales Overview */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-green-400" />
                            Sales Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={DollarSign}
                                title="Daily Sales"
                                value={`₹${analytics?.orderStats?.dailySales?.amount || 0}`}
                                subtitle={`${analytics?.orderStats?.dailySales?.count || 0} orders today`}
                                color="green"
                            />
                            <StatCard
                                icon={Calendar}
                                title="Monthly Sales"
                                value={`₹${analytics?.orderStats?.monthlySales?.amount || 0}`}
                                subtitle={`${analytics?.orderStats?.monthlySales?.count || 0} orders this month`}
                                color="blue"
                            />
                            <StatCard
                                icon={BarChart3}
                                title="Yearly Sales"
                                value={`₹${analytics?.orderStats?.yearlySales?.amount || 0}`}
                                subtitle={`${analytics?.orderStats?.yearlySales?.count || 0} orders this year`}
                                color="purple"
                            />
                        </div>
                    </div>

                    {/* Operational Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={DollarSign}
                            title="Total Revenue"
                            value={`₹${analytics?.orderStats?.totalRevenue || 0}`}
                            color="emerald"
                            subtitle="Lifetime earnings"
                        />
                        <StatCard
                            icon={Package}
                            title="Active Orders"
                            value={analytics?.orderStats?.activeOrders || 0}
                            color="cyan"
                            subtitle={`Total Sales: ${analytics?.orderStats?.totalSales || 0}`}
                        />
                        <StatCard
                            icon={Clock}
                            title="Pending Payments"
                            value={analytics?.orderStats?.pendingPayments?.count || 0}
                            color="yellow"
                            subtitle={`Amount: ₹${analytics?.orderStats?.pendingPayments?.amount || 0}`}
                        />
                        <StatCard
                            icon={Users}
                            title="Total Users"
                            value={analytics?.userStats?.totalUsers || 0}
                            color="pink"
                            subtitle="Registered accounts"
                        />
                    </div>

                    {/* Service Type Breakdown */}
                    {analytics?.orderStats?.serviceTypeCounts?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Active Services by Type</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {analytics.orderStats.serviceTypeCounts.map((service) => (
                                    <div key={service.type} className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <p className="text-gray-400 text-sm uppercase mb-1">{service.type}</p>
                                        <p className="text-2xl font-bold text-white">{service.count}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-3 text-gray-400 font-semibold">Order ID</th>
                                        <th className="py-3 text-gray-400 font-semibold">Customer</th>
                                        <th className="py-3 text-gray-400 font-semibold">Plan</th>
                                        <th className="py-3 text-gray-400 font-semibold">Amount</th>
                                        <th className="py-3 text-gray-400 font-semibold">Status</th>
                                        <th className="py-3 text-gray-400 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics?.recentOrders?.map(order => (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 text-white font-mono">#{order.id}</td>
                                            <td className="py-3 text-white">{order.userName}</td>
                                            <td className="py-3 text-gray-300">{order.planName}</td>
                                            <td className="py-3 text-white font-medium">₹{order.finalPrice}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                                    order.status === 'payment_uploaded' ? 'bg-blue-500/20 text-blue-300' :
                                                        order.status === 'pending_upload' ? 'bg-yellow-500/20 text-yellow-300' :
                                                            order.status === 'completed' ? 'bg-purple-500/20 text-purple-300' :
                                                                'bg-gray-500/20 text-gray-300'
                                                    }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:bg-white/5 transition-all group"
                        >
                            <FileText size={32} className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2">Manage Orders</h3>
                            <p className="text-gray-400 text-sm">View and manage all customer orders</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/manager')}
                            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:bg-white/5 transition-all group"
                        >
                            <BarChart3 size={32} className="text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2">Order Manager</h3>
                            <p className="text-gray-400 text-sm">Active & expired orders management</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/promos')}
                            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:bg-white/5 transition-all group"
                        >
                            <BarChart3 size={32} className="text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2">Promo Codes</h3>
                            <p className="text-gray-400 text-sm">Create and manage promotional codes</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/plans')}
                            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:bg-white/5 transition-all group"
                        >
                            <Package size={32} className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2">Manage Plans</h3>
                            <p className="text-gray-400 text-sm">Add, edit, or remove hosting plans</p>
                        </button>

                        <button
                            onClick={() => navigate('/admin/users')}
                            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-left hover:bg-white/5 transition-all group"
                        >
                            <Users size={32} className="text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
                            <p className="text-gray-400 text-sm">Manage users and assign roles</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboardPage;
