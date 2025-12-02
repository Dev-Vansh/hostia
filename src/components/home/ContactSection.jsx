import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/ui/use-toast';

const ContactSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const handleDiscordClick = () => {
    toast({
      title: "🚧 Discord Integration Coming Soon!",
      description: "We're working on our Discord community. Stay tuned!",
    });
  };

  return (
    <section id="contact" ref={ref} className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions? We're here to help 24/7
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm block mb-1">Email</span>
                  <a href="mailto:support@hostia.com" className="text-white hover:text-blue-400 transition-colors">
                    support@hostia.com
                  </a>
                  <br />
                  <a href="mailto:sales@hostia.com" className="text-white hover:text-blue-400 transition-colors">
                    sales@hostia.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm block mb-1">Phone</span>
                  <a href="tel:+911234567890" className="text-white hover:text-blue-400 transition-colors">
                    +91 123 456 7890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-gray-400 text-sm block mb-1">Address</span>
                  <p className="text-white">
                    WeebPoll Technologies India Private Limited<br />
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
              <MessageCircle size={40} className="text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">Join Our Discord</h3>
            <p className="text-gray-300 mb-6">
              Connect with our community and get instant support from our team and other users
            </p>

            <button
              onClick={handleDiscordClick}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-semibold transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Join Discord Server
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;