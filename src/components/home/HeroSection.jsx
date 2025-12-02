import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Antigravity from '@/components/Antigravity';

const HeroSection = () => {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        <div 
          className="absolute inset-0 -top-1/4 bg-gradient-to-b from-blue-900/20 via-black/30 to-transparent blur-3xl rounded-full"
          style={{ transform: 'translateZ(0)' }}
        />

      <div className="container mx-auto text-center z-10">
        <Antigravity strength={15}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-6 relative"
            style={{
              textShadow: '0 0 15px rgba(255, 255, 255, 0.3), 0 0 30px rgba(147, 197, 253, 0.4)',
            }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-blue-300 bg-clip-text text-transparent opacity-50 blur-lg"
              animate={{
                backgroundPosition: ['-100% center', '300% center'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
            />
             <motion.span
                style={{
                    background: 'linear-gradient(90deg, #ffffff 0%, #a0cffc 25%, #ffffff 50%, #a0cffc 75%, #ffffff 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
                animate={{
                    backgroundPosition: ['0% center', '200% center'],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                }}
             >
                HOSTIA
             </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Unleash unparalleled performance with our cutting-edge hosting solutions, engineered for speed and reliability.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Antigravity strength={25}>
            <button
              onClick={scrollToServices}
              className="group relative px-8 py-4 bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
               <span className="absolute -inset-full top-0 block -skew-x-12 -translate-x-full transform bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40 group-hover:animate-shimmer" />
              <span className="text-white font-medium z-10">Explore Services</span>
              <ArrowRight size={20} className="text-white group-hover:translate-x-1 transition-transform z-10" />
            </button>
            </Antigravity>

            <Antigravity strength={25}>
            <a
              href="#contact"
              className="relative group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 text-white font-medium"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                <span className="relative flex items-center gap-2">
                    <Sparkles size={20} />
                    Get Started
                </span>
            </a>
            </Antigravity>
          </motion.div>
        </motion.div>
        </Antigravity>
      </div>
    </section>
  );
};

export default HeroSection;