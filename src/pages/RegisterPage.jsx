import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { register } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Hash, Lock, CheckCircle } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        discordId: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);

        try {
            await register({
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                discordId: formData.discordId,
                password: formData.password
            });

            toast({
                title: 'Success!',
                description: 'Registration successful. Please login.',
                variant: 'default'
            });

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            toast({
                title: 'Registration Failed',
                description: error.response?.data?.error || 'An error occurred',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Register - HOSTIA</title>
            </Helmet>
            <ParticleBackground />
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent mb-2">
                                Create Account
                            </h1>
                            <p className="text-gray-400">Join HOSTIA and get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <User size={16} className="inline mr-2" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Mail size={16} className="inline mr-2" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Phone size={16} className="inline mr-2" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Hash size={16} className="inline mr-2" />
                                    Discord ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="discordId"
                                    value={formData.discordId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="username#1234"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Lock size={16} className="inline mr-2" />
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <CheckCircle size={16} className="inline mr-2" />
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default RegisterPage;
