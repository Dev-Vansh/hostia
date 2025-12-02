import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/50 backdrop-blur-lg border-t border-white/10 mt-20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              HOSTIA
            </motion.span>
            <p className="mt-4 text-gray-400 text-sm">
              Premium hosting solutions powered by WeebPoll Technologies India Private Limited.
            </p>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Quick Links</span>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                About
              </Link>
              <a href="/#services" className="text-gray-400 hover:text-white transition-colors text-sm">
                Services
              </a>
              <a href="/#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                Pricing
              </a>
            </div>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Legal</span>
            <div className="flex flex-col space-y-2">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Refund Policy
              </Link>
            </div>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Contact</span>
            <div className="flex flex-col space-y-3">
              <a href="mailto:support@hostia.com" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <Mail size={16} className="mr-2" />
                support@hostia.com
              </a>
              <a href="mailto:sales@hostia.com" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <Mail size={16} className="mr-2" />
                sales@hostia.com
              </a>
              <a href="tel:+911234567890" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <Phone size={16} className="mr-2" />
                +91 123 456 7890
              </a>
              <div className="flex items-start text-gray-400 text-sm">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>WeebPoll Technologies India Private Limited, Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Hostia - WeebPoll Technologies India Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;