import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Clock, Sparkles } from 'lucide-react';

const WebHostingSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-blue-900/20 to-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-12 md:p-16 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Clock size={40} className="text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent"
            >
              Web Hosting
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-2 mb-6"
            >
              <Sparkles size={20} className="text-yellow-400" />
              <span className="text-yellow-300 font-semibold">Coming Soon</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            >
              We're working on something amazing! Premium web hosting with lightning-fast speeds, 
              unlimited bandwidth, and 99.9% uptime guarantee.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-gray-400"
            >
              Stay tuned for the launch of our revolutionary web hosting platform
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WebHostingSection;