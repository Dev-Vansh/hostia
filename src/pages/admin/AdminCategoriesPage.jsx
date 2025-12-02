import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '@/api/categories';
import { useToast } from '@/hooks/use-toast';
import { Tag, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const AdminCategoriesPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'vps',
        displayOrder: 0,
        isActive: 1
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load categories',
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
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'vps',
            displayOrder: 0,
            isActive: 1
        });
        setIsEditing(false);
        setCurrentCategory(null);
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        setFormData({
            name: category.name,
            type: category.type,
            displayOrder: category.displayOrder,
            isActive: category.isActive
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await deleteCategory(id);
            toast({
                title: 'Success',
                description: 'Category deleted successfully',
                variant: 'default'
            });
            loadCategories();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || 'Failed to delete category',
                variant: 'destructive'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const categoryData = {
                ...formData,
                displayOrder: parseInt(formData.displayOrder),
                isActive: parseInt(formData.isActive)
            };

            if (isEditing) {
                await updateCategory(currentCategory.id, categoryData);
                toast({ title: 'Success', description: 'Category updated successfully' });
            } else {
                await createCategory(categoryData);
                toast({ title: 'Success', description: 'Category created successfully' });
            }

            resetForm();
            loadCategories();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.error || (isEditing ? 'Failed to update category' : 'Failed to create category'),
                variant: 'destructive'
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Manage Categories - Admin</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen px-4 py-12">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Manage Categories</h1>
                            <p className="text-gray-400">Add, edit, or remove plan categories</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8"
                            >
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                                    {isEditing ? 'Edit Category' : 'Add New Category'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g. Intel Xeon"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="vps">VPS Hosting</option>
                                            <option value="bot">Bot Hosting</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Display Order</label>
                                        <input
                                            type="number"
                                            name="displayOrder"
                                            value={formData.displayOrder}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="0"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                        <select
                                            name="isActive"
                                            value={formData.isActive}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} />
                                            {isEditing ? 'Update Category' : 'Create Category'}
                                        </button>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        </div>

                        {/* Categories List */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 gap-4">
                                {loading ? (
                                    <div className="text-center py-12 text-gray-400">Loading categories...</div>
                                ) : categories.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">No categories found. Create one!</div>
                                ) : (
                                    categories.map((category) => (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`bg-black/50 backdrop-blur-xl border ${category.isActive ? 'border-white/10' : 'border-red-500/30'} rounded-xl p-6 flex justify-between items-center`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs ${category.type === 'bot' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                                        {category.type === 'bot' ? 'Bot Hosting' : 'VPS'}
                                                    </span>
                                                    {!category.isActive && (
                                                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 text-sm">Display Order: {category.displayOrder}</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminCategoriesPage;
