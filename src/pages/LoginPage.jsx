import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { login, adminLogin } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const LoginPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setLoading(true);

        try {
            let response;
            let userRole;
            let loginError;

            // Try admin login first, then user login
            try {
                response = await adminLogin(formData.email, formData.password);
                userRole = response.user?.role;
            } catch (adminLoginError) {
                loginError = adminLoginError;
                // If admin login fails, try regular user login
                try {
                    response = await login(formData.email, formData.password);
                    userRole = response.user?.role;
                } catch (userLoginError) {
                    // Both failed, throw the admin error (more specific)
                    throw adminLoginError;
                }
            }

            // Dispatch event to update Navbar
            window.dispatchEvent(new Event('auth-change'));

            if (userRole === 'admin') {
                toast({
                    title: 'Welcome Admin!',
                    description: 'Login successful',
                    variant: 'default'
                });

                setTimeout(() => {
                    navigate('/admin/dashboard');
                }, 1000);
            } else {
                toast({
                    title: 'Welcome back!',
                    description: 'Login successful',
                    variant: 'default'
                });

                setTimeout(() => {
                    navigate('/client-area');
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Login Failed',
                description: error.response?.data?.error || 'Invalid credentials',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login - HOSTIA</title>
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
                                Welcome Back
                            </h1>
                            <p className="text-gray-400">Login to your HOSTIA account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Mail size={16} className="inline mr-2" />
                                    Email Address
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
                                    <Lock size={16} className="inline mr-2" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <p className="text-center text-gray-400 mt-6">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Register here
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default LoginPage;
