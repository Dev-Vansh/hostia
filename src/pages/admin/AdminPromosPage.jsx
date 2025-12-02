import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getPromos, createPromo, updatePromo, deletePromo } from '@/api/promos';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';

const AdminPromosPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPromo, setCurrentPromo] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        type: 'flat',
        value: '',
        usageLimit: '',
        expiryDate: '',
        isActive: 1
    });

    useEffect(() => {
        loadPromos();
    }, []);

    const loadPromos = async () => {
        try {
            const promosData = await getPromos();
            setPromos(promosData);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load promos',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Auto-uppercase promo codes
            [name]: name === 'code' ? value.toUpperCase() : value
        }));
    };

    const resetForm = () => {
        setFormData({
            code: '',
            type: 'flat',
            value: '',
            usageLimit: '',
            expiryDate: '',
            isActive: 1
        });
        setIsEditing(false);
        setCurrentPromo(null);
        setShowModal(false);
    };

    const handleCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (promo) => {
        setIsEditing(true);
        setCurrentPromo(promo);
        setFormData({
            code: promo.code,
            type: promo.type,
            value: promo.value,
            usageLimit: promo.usageLimit || '',
            expiryDate: promo.expiryDate ? new Date(promo.expiryDate).toISOString().split('T')[0] : '',
            isActive: promo.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this promo code?')) return;

        try {
            await deletePromo(id);
            toast({
                title: 'Success',
                description: 'Promo code deleted successfully',
                variant: 'default'
            });
            loadPromos();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete promo code',
                variant: 'destructive'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const promoData = {
                ...formData,
                value: parseFloat(formData.value),
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                isActive: parseInt(formData.isActive)
            };

            if (isEditing) {
                await updatePromo(currentPromo.id, promoData);
                toast({ title: 'Success', description: 'Promo updated successfully' });
            } else {
                await createPromo(promoData);
                toast({ title: 'Success', description: 'Promo created successfully' });
            }

            resetForm();
            loadPromos();
        } catch (error) {
            toast({
                title: 'Error',
                description: isEditing ? 'Failed to update promo' : 'Failed to create promo',
                variant: 'destructive'
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Promos - Admin - HOSTIA</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen px-4 py-12 relative z-10">
                <div className="container mx-auto max-w-6xl">
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
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
                                Promo Codes
                            </h1>
                            <button
                                onClick={handleCreate}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/40 flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Create Promo
                            </button>
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading promos...</div>
                    ) : promos.length === 0 ? (
                        <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                            <h3 className="text-xl font-semibold text-white mb-2">No Promos Yet</h3>
                            <p className="text-gray-400">Create your first promo code to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {promos.map((promo) => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{promo.code}</h3>
                                            <p className="text-gray-400">
                                                {promo.type === 'flat' ? `₹${promo.value} off` : `${promo.value}% off`}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${promo.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                            {promo.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div>
                                            <span className="text-gray-400">Usage:</span>
                                            <span className="text-white ml-2">{promo.usedCount} / {promo.usageLimit || '∞'}</span>
                                        </div>
                                        {promo.expiryDate && (
                                            <div>
                                                <span className="text-gray-400">Expires:</span>
                                                <span className="text-white ml-2">{new Date(promo.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(promo)}
                                            className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(promo.id)}
                                            className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="bg-black border border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white uppercase"
                                placeholder="SUMMER2024"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                >
                                    <option value="flat">Flat Amount (₹)</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Value</label>
                                <input
                                    type="number"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                    placeholder="50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Usage Limit</label>
                                <input
                                    type="number"
                                    name="usageLimit"
                                    value={formData.usageLimit}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                    placeholder="Optional"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Status</label>
                            <select
                                name="isActive"
                                value={formData.isActive}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white"
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all"
                        >
                            {isEditing ? 'Update Promo' : 'Create Promo'}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminPromosPage;
