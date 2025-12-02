import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getPlanById } from '@/api/plans';
import { createOrder, uploadPayment, getOrderQR, getOrderById } from '@/api/orders';
import { validatePromo } from '@/api/promos';
import { logout } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { Package, Tag, QrCode, Upload, CheckCircle, ArrowLeft, LogOut } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const OrderPage = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const existingOrderId = searchParams.get('orderId');
    const { toast } = useToast();

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [promoCode, setPromoCode] = useState('');
    const [promoValid, setPromoValid] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [qrCode, setQrCode] = useState('');
    const [qrLoading, setQrLoading] = useState(false);
    const [qrError, setQrError] = useState(null);
    const [orderId, setOrderId] = useState(existingOrderId || null);
    const [screenshot, setScreenshot] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(existingOrderId ? 2 : 1); // 1: Order, 2: Payment

    const [orderItems, setOrderItems] = useState([]);

    const loadPlan = async () => {
        try {
            const planData = await getPlanById(planId);
            setPlan(planData);
            setOriginalPrice(planData.price);
            setFinalPrice(planData.price);
            setOrderItems([{ ...planData }]);

            if (existingOrderId) {
                try {
                    setQrLoading(true);
                    const qr = await getOrderQR(existingOrderId);
                    setQrCode(qr);
                    setQrLoading(false);
                    setStep(2);
                } catch (e) {
                    console.error("QR fetch failed in loadPlan fallback");
                    setQrError('Failed to generate QR code.');
                    setQrLoading(false);
                }
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load plan details',
                variant: 'destructive'
            });
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const loadOrder = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // Use getOrderById for reliability
                const order = await getOrderById(existingOrderId);

                if (order) {
                    setFinalPrice(order.finalPrice);
                    setOriginalPrice(order.originalPrice);

                    // Fetch QR code with error handling
                    setQrLoading(true);
                    setQrError(null);
                    try {
                        const qr = await getOrderQR(existingOrderId);
                        setQrCode(qr);
                        setQrLoading(false);
                    } catch (qrErr) {
                        console.error('QR generation failed:', qrErr);
                        setQrError('Failed to generate QR code. Please contact support.');
                        setQrLoading(false);
                    }

                    if (order.items) {
                        try {
                            setOrderItems(JSON.parse(order.items));
                        } catch (e) {
                            setOrderItems([]);
                        }
                    } else {
                        // Fallback for single item orders
                        setOrderItems([{ name: order.planName, price: order.originalPrice, type: order.planType }]);
                    }

                    // Try to set plan details if possible, but don't fail if not
                    if (order.planId) {
                        try {
                            const planData = await getPlanById(order.planId);
                            setPlan(planData);
                        } catch (e) {
                            console.log("Could not fetch plan details, using order details");
                        }
                    }

                    setStep(2);
                    setLoading(false);
                    return;
                }
            }
            // If not found or error, fall back to plan load
            loadPlan();
        } catch (error) {
            console.error("Error loading order:", error);
            loadPlan();
        }
    };

    useEffect(() => {
        if (existingOrderId) {
            loadOrder();
        } else {
            loadPlan();
        }
    }, [planId, existingOrderId]);

    const handlePromoValidation = async () => {
        if (!promoCode.trim()) return;

        try {
            const result = await validatePromo(promoCode, planId, originalPrice);

            if (result.valid) {
                setDiscount(result.discountAmount);
                setFinalPrice(result.finalPrice);
                setPromoValid(true);

                toast({
                    title: 'Promo Applied!',
                    description: `You saved ₹${result.discountAmount}`,
                    variant: 'default'
                });
            }
        } catch (error) {
            setPromoValid(false);
            setDiscount(0);
            setFinalPrice(originalPrice);

            console.error('Promo validation error:', error);
            toast({
                title: 'Invalid Promo',
                description: error.response?.data?.error || `Error: ${error.message}`,
                variant: 'destructive'
            });
        }
    };

    const handleCreateOrder = async () => {
        try {
            setLoading(true);
            const response = await createOrder(planId, promoValid ? promoCode : null);

            setOrderId(response.orderId);

            // Fetch QR code for the newly created order
            setQrLoading(true);
            setQrError(null);
            try {
                const qr = await getOrderQR(response.orderId);
                setQrCode(qr);
                setQrLoading(false);
            } catch (qrErr) {
                console.error('QR generation failed:', qrErr);
                setQrError('Failed to generate QR code. Please contact support.');
                setQrLoading(false);
            }

            setStep(2);

            toast({
                title: 'Order Created!',
                description: 'Please scan the QR code and upload payment proof',
                variant: 'default'
            });
        } catch (error) {
            toast({
                title: 'Order Failed',
                description: error.response?.data?.error || 'Failed to create order',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: 'File Too Large',
                    description: 'Maximum file size is 5MB',
                    variant: 'destructive'
                });
                return;
            }
            setScreenshot(file);
        }
    };

    const handlePaymentUpload = async () => {
        if (!screenshot) {
            toast({
                title: 'Upload Required',
                description: 'Please select a payment screenshot',
                variant: 'destructive'
            });
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('screenshot', screenshot);
            if (transactionId) {
                formData.append('transactionId', transactionId);
            }

            await uploadPayment(orderId, formData);

            toast({
                title: 'Success!',
                description: 'Payment uploaded successfully. Admin will verify shortly.',
                variant: 'default'
            });

            setTimeout(() => {
                navigate('/client-area');
            }, 2000);
        } catch (error) {
            toast({
                title: 'Upload Failed',
                description: error.response?.data?.error || 'Failed to upload payment',
                variant: 'destructive'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading && !plan && !orderItems.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ParticleBackground />
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Order {plan?.name || 'Service'} - HOSTIA</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen px-4 py-12">
                <div className="container mx-auto max-w-4xl">
                    {/* Navigation Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-center mb-8"
                    >
                        <button
                            onClick={() => navigate('/client-area')}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Dashboard
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent mb-2">
                            Complete Your Order
                        </h1>
                        <p className="text-gray-400">Step {step} of 2</p>
                    </motion.div>

                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Order Items */}
                            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Package size={28} className="text-blue-400" />
                                    <h2 className="text-2xl font-bold text-white">Order Items</h2>
                                </div>

                                <div className="space-y-4">
                                    {orderItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                                <p className="text-sm text-blue-400">{item.type?.toUpperCase()} {item.processor ? `• ${item.processor}` : ''}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {plan?.features && orderItems.length === 1 && (
                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-3">Plan Features</h4>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-gray-300 text-sm">
                                                    <CheckCircle size={16} className="text-blue-400 mr-2" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Promo Code */}
                            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Tag size={24} className="text-blue-400" />
                                    <h3 className="text-xl font-bold text-white">Promo Code</h3>
                                </div>

                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="Enter promo code"
                                        className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={handlePromoValidation}
                                        className="px-6 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {promoValid === true && (
                                    <p className="text-green-400 text-sm mt-2">✓ Promo applied successfully!</p>
                                )}
                                {promoValid === false && (
                                    <p className="text-red-400 text-sm mt-2">✗ Invalid promo code</p>
                                )}
                            </div>

                            {/* Price Summary */}
                            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Price Summary</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Original Price</span>
                                        <span>₹{originalPrice}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Discount</span>
                                            <span>- ₹{discount}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-white/10 pt-3">
                                        <div className="flex justify-between text-white text-xl font-bold">
                                            <span>Final Amount</span>
                                            <span>₹{finalPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateOrder}
                                    disabled={loading}
                                    className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">Scan to Pay</h2>
                                    <p className="text-gray-400">Scan the QR code below with any UPI app</p>
                                </div>

                                <div className="bg-white p-4 rounded-xl inline-block mb-6">
                                    {qrLoading ? (
                                        <div className="w-64 h-64 flex flex-col items-center justify-center text-gray-600">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                                            <p className="text-sm">Generating QR Code...</p>
                                        </div>
                                    ) : qrError ? (
                                        <div className="w-64 h-64 flex flex-col items-center justify-center text-red-600">
                                            <p className="text-sm text-center px-4">{qrError}</p>
                                        </div>
                                    ) : qrCode ? (
                                        <img src={qrCode} alt="Payment QR Code" className="w-64 h-64" />
                                    ) : (
                                        <div className="w-64 h-64 flex items-center justify-center text-black">
                                            <p className="text-sm">Loading...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="text-2xl font-bold text-white mb-8">
                                    Amount: ₹{finalPrice}
                                </div>

                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="text-left">
                                        <label className="block text-sm text-gray-400 mb-2">
                                            Upload Payment Screenshot
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="screenshot-upload"
                                            />
                                            <label
                                                htmlFor="screenshot-upload"
                                                className="flex items-center justify-center w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-gray-300 cursor-pointer hover:bg-white/5 transition-all border-dashed"
                                            >
                                                <Upload size={20} className="mr-2" />
                                                {screenshot ? screenshot.name : 'Choose File'}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="text-left">
                                        <label className="block text-sm text-gray-400 mb-2">
                                            Transaction ID (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            placeholder="Enter UPI Transaction ID"
                                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        onClick={handlePaymentUpload}
                                        disabled={uploading || !screenshot}
                                        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? 'Uploading...' : 'Confirm Payment'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderPage;
