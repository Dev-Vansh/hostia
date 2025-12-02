import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getPlans } from '@/api/plans';
import { getCategories } from '@/api/categories';
import { isAuthenticated } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { Check, Star, Server, Cpu, Shield, ShoppingCart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { useCart } from '@/context/CartContext';

const ServicesPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [plans, setPlans] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('xeon');
    const { addToCart } = useCart();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [plansData, categoriesData] = await Promise.all([
                getPlans(),
                getCategories('vps')
            ]);
            setPlans(plansData);
            setCategories(categoriesData);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load services',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOrder = (plan) => {
        addToCart(plan);
        navigate('/cart');
    };

    // Group plans
    const botPlans = plans.filter(p => p.type === 'bot');
    const vpsPlans = plans.filter(p => p.type === 'vps');

    // Hardcoded processor filters
    const vpsByProcessor = {
        xeon: vpsPlans.filter(p => p.processor?.toLowerCase().includes('xeon')),
        platinum: vpsPlans.filter(p => p.processor?.toLowerCase().includes('platinum')),
        ryzen: vpsPlans.filter(p => p.processor?.toLowerCase().includes('ryzen'))
    };

    // Get plans for a specific category
    const getPlansByCategory = (categoryId) => {
        return vpsPlans.filter(p => p.categoryId === categoryId);
    };

    const PlanCard = ({ plan, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-black/50 backdrop-blur-xl border ${!plan.isActive ? 'border-red-500/30' : 'border-white/10'} rounded-2xl p-8 hover:bg-white/5 transition-all duration-300 flex flex-col h-full`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 hover:opacity-100 rounded-2xl transition-opacity" />

            {/* Out of Stock Badge */}
            {!plan.isActive && (
                <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30 z-20">
                    Out of Stock
                </div>
            )}

            <div className="text-center mb-8 relative z-10">
                <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                {plan.processor && <p className="text-sm text-blue-400 mb-3">{plan.processor}</p>}
                <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-gray-400 mb-1">/month</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow relative z-10">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                        <Check size={20} className="text-blue-400 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="flex gap-3 relative z-10">
                <button
                    onClick={() => plan.isActive ? handleOrder(plan) : null}
                    disabled={!plan.isActive}
                    className={`flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${plan.isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/40'
                        : 'bg-gray-700 cursor-not-allowed opacity-50'
                        }`}
                >
                    {plan.isActive ? 'Order Now' : 'Out of Stock'}
                </button>

                <button
                    onClick={() => plan.isActive ? addToCart(plan) : null}
                    disabled={!plan.isActive}
                    className={`p-3 rounded-lg transition-all duration-300 flex items-center justify-center ${plan.isActive
                        ? 'bg-white/10 hover:bg-white/20 text-white hover:text-blue-400 border border-white/10'
                        : 'bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    title="Add to Cart"
                >
                    <ShoppingCart size={20} />
                </button>
            </div>
        </motion.div>
    );

    return (
        <>
            <Helmet>
                <title>Services - HOSTIA</title>
            </Helmet>
            <Navbar />
            <ParticleBackground />

            <div className="min-h-screen pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
                            Our Services
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Premium hosting solutions for every need.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading plans...</div>
                    ) : (
                        <>
                            {/* Bot Hosting */}
                            {botPlans.length > 0 && (
                                <div className="mb-20">
                                    <div className="flex items-center justify-center gap-3 mb-12">
                                        <Shield className="text-blue-400" size={32} />
                                        <h2 className="text-3xl font-bold text-white">Bot Hosting</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {botPlans.map((plan, index) => (
                                            <PlanCard key={plan.id} plan={plan} index={index} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* VPS Hosting */}
                            {vpsPlans.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-center gap-3 mb-8">
                                        <Server className="text-blue-400" size={32} />
                                        <h2 className="text-3xl font-bold text-white">VPS Hosting</h2>
                                    </div>

                                    <Tabs value={selectedTab} className="w-full" onValueChange={setSelectedTab}>
                                        <div className="flex justify-center mb-12">
                                            <TabsList className="bg-black/50 backdrop-blur-xl border border-white/10 p-1 rounded-lg">
                                                {/* Hardcoded processor tabs */}
                                                <TabsTrigger value="xeon" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2">
                                                    Intel Xeon
                                                </TabsTrigger>
                                                <TabsTrigger value="platinum" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2">
                                                    Intel Platinum
                                                </TabsTrigger>
                                                <TabsTrigger value="ryzen" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2">
                                                    AMD Ryzen
                                                </TabsTrigger>

                                                {/* Dynamic category tabs */}
                                                {categories.map((category) => (
                                                    <TabsTrigger
                                                        key={category.id}
                                                        value={`cat-${category.id}`}
                                                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-2"
                                                    >
                                                        {category.name}
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                        </div>

                                        {/* Hardcoded processor content */}
                                        {Object.entries(vpsByProcessor).map(([processor, processorPlans]) => (
                                            <TabsContent key={processor} value={processor}>
                                                {processorPlans.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                        {processorPlans.map((plan, index) => (
                                                            <PlanCard key={plan.id} plan={plan} index={index} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-gray-500">
                                                        No plans available for this processor.
                                                    </div>
                                                )}
                                            </TabsContent>
                                        ))}

                                        {/* Dynamic category content */}
                                        {categories.map((category) => {
                                            const categoryPlans = getPlansByCategory(category.id);
                                            return (
                                                <TabsContent key={category.id} value={`cat-${category.id}`}>
                                                    {categoryPlans.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                            {categoryPlans.map((plan, index) => (
                                                                <PlanCard key={plan.id} plan={plan} index={index} />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-12 text-gray-500">
                                                            No plans available for this category.
                                                        </div>
                                                    )}
                                                </TabsContent>
                                            );
                                        })}
                                    </Tabs>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServicesPage;
