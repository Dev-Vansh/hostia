import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/api/orders';
import { useToast } from '@/hooks/use-toast';
import ParticleBackground from '@/components/ParticleBackground';

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        try {
            // For now, we'll create an order with the first item and then add others?
            // Or we need to update the createOrder API to accept multiple items.
            // Based on the plan, we need to update the backend first.
            // But let's assume the backend will be updated to accept `items` array.

            // Construct payload
            const items = cartItems.map(item => item.id);

            // We'll send the first planId as the "main" plan for backward compatibility if needed,
            // or we might need a special "multi-item" plan ID or just handle it in backend.
            // Let's assume we send the first planId and an extra `items` field.
            const mainPlanId = items[0];

            const response = await createOrder(mainPlanId, null, items); // We need to update createOrder signature or pass object

            toast({
                title: "Order Created",
                description: "Redirecting to payment...",
            });

            clearCart();
            navigate(`/order/${mainPlanId}?orderId=${response.orderId}`);
        } catch (error) {
            console.error(error);
            toast({
                title: "Checkout Failed",
                description: "Failed to create order. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Shopping Cart - HOSTIA</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent mb-2">
                            Your Cart
                        </h1>
                        <p className="text-gray-400">
                            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                        </p>
                    </motion.div>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-20 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl">
                            <ShoppingCart size={48} className="mx-auto text-gray-600 mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                            <p className="text-gray-400 mb-6">Looks like you haven't added any services yet.</p>
                            <button
                                onClick={() => navigate('/services')}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                            >
                                Browse Services
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.cartId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-blue-500/30 transition-all"
                                    >
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                                            <p className="text-sm text-blue-400">{item.type.toUpperCase()} • {item.processor || 'Standard'}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-white">₹{item.price}</p>
                                                <p className="text-xs text-gray-500">/month</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.cartId)}
                                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Remove"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
                                    <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-300">
                                            <span>Subtotal</span>
                                            <span>₹{getCartTotal()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span>Tax</span>
                                            <span>₹0</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-3 flex justify-between text-white text-xl font-bold">
                                            <span>Total</span>
                                            <span>₹{getCartTotal()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
                                    >
                                        Checkout <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartPage;
