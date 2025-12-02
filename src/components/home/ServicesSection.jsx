import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Server, Cpu, Globe } from 'lucide-react';
import Antigravity from '@/components/Antigravity';

const ServicesSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const services = [
    {
      icon: Server,
      title: 'Bot Hosting',
      description: 'High-performance bot hosting with 24/7 uptime, dedicated resources, and automatic backups.',
      features: ['99.9% Uptime', 'DDoS Protection', 'Instant Setup', 'Free SSL']
    },
    {
      icon: Cpu,
      title: 'VPS Hosting',
      description: 'Powerful VPS solutions with Intel Xeon, Intel Platinum, and AMD Ryzen processors.',
      features: ['Full Root Access', 'NVMe Storage', 'Dedicated IP', 'Custom OS']
    },
    {
      icon: Globe,
      title: 'Web Hosting',
      description: 'Coming soon! Premium web hosting with lightning-fast speeds and unlimited bandwidth.',
      features: ['Coming Soon', 'Stay Tuned', 'Amazing Features', 'Great Performance']
    }
  ];

  return (
    <section id="services" ref={ref} className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
            Our Core Services
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cutting-edge hosting solutions tailored to your needs, built for performance and reliability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Antigravity key={service.title}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/5 hover:border-blue-400/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <service.icon size={32} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-white">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            </Antigravity>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;