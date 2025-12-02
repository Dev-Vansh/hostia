import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, LogOut, ShoppingCart, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/ui/use-toast';
import { isAuthenticated, logout } from '@/api/auth';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Check if we're on the client area page or related pages (cart, order, services)
  const isClientArea = location.pathname.startsWith('/client-area') || location.pathname.startsWith('/cart') || location.pathname.startsWith('/order') || location.pathname === '/services';
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const checkAuth = () => {
      setUser(isAuthenticated() ? JSON.parse(localStorage.getItem('user')) : null);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Pricing', path: '/#pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/#contact' }
  ];

  const handleNavClick = (path) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (route === '' || route === location.pathname) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  };

  const handleDiscordClick = () => {
    toast({
      title: "🚧 Discord Integration Coming Soon!",
      description: "We're working on our Discord community. Stay tuned!",
    });
  };

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  // 4. Admin Panel — Remove All Public Navigation
  if (isAdminPage) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              HOSTIA
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {/* Client Area Navigation with Dashboard Button */}
            {isClientArea ? (
              <>
                <button
                  onClick={() => navigate('/client-area')}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Package size={18} />
                  Dashboard
                </button>

                <button
                  onClick={() => navigate('/cart')}
                  className="relative bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Cart
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleDiscordClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-300"
                >
                  <MessageCircle size={18} />
                  Discord
                </button>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300"
                  >
                    <LogOut size={18} className="rotate-180" />
                    Login
                  </button>
                )}
              </>
            ) : (
              /* Public Pages Navigation */
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={cn(
                      'text-sm font-medium transition-colors relative group',
                      location.pathname === link.path || (link.path.includes('#') && location.pathname === '/')
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-white transition-all group-hover:w-full" />
                  </Link>
                ))}

                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-1">
                  <button
                    onClick={handleDiscordClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors duration-300"
                  >
                    <MessageCircle size={18} />
                    Discord
                  </button>

                  <button
                    onClick={() => navigate('/client-area')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 font-medium py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Client Area
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {isClientArea ? (
                <>
                  <button
                    onClick={() => navigate('/client-area')}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Package size={18} />
                    Dashboard
                  </button>

                  <button
                    onClick={() => navigate('/cart')}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Cart ({cartItems.length})
                  </button>

                  <button
                    onClick={handleDiscordClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <MessageCircle size={18} />
                    Join Discord
                  </button>

                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <LogOut size={18} className="rotate-180" />
                      Login
                    </button>
                  )}
                </>
              ) : (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => handleNavClick(link.path)}
                      className={cn(
                        'text-base font-medium transition-colors py-2',
                        location.pathname === link.path || (link.path.includes('#') && location.pathname === '/')
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 space-y-2">
                    <button
                      onClick={handleDiscordClick}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                      <MessageCircle size={18} />
                      Join Discord
                    </button>

                    <button
                      onClick={() => navigate('/client-area')}
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      Client Area
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;