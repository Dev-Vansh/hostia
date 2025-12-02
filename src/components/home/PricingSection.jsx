import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/api/auth';
import { Check, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import Antigravity from '@/components/Antigravity';

const PricingSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [selectedProcessor, setSelectedProcessor] = useState('xeon');
  const navigate = useNavigate();

  const handleOrder = (planId) => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      navigate(`/order/${planId}`);
    }
  };

  const botHostingPlans = [
    {
      id: 1,
      name: 'Starter',
      price: '₹299',
      features: ['1 GB RAM', '10 GB Storage', '1 CPU Core', '24/7 Support', 'DDoS Protection'],
      popular: false
    },
    {
      id: 2,
      name: 'Professional',
      price: '₹599',
      features: ['2 GB RAM', '25 GB Storage', '2 CPU Cores', '24/7 Priority Support', 'DDoS Protection', 'Free Backups'],
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: '₹1,199',
      features: ['4 GB RAM', '50 GB Storage', '4 CPU Cores', '24/7 Premium Support', 'Advanced DDoS Protection', 'Daily Backups', 'Dedicated IP'],
      popular: false
    }
  ];

  const vpsPlans = {
    xeon: [
      { id: 4, name: 'VPS Basic', price: '₹799', processor: 'Intel Xeon E5-2680v4', features: ['2 GB RAM', '50 GB NVMe', '2 vCPU Cores', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network'], popular: false },
      { id: 5, name: 'VPS Pro', price: '₹1,499', processor: 'Intel Xeon E5-2680v4', features: ['4 GB RAM', '100 GB NVMe', '4 vCPU Cores', 'Full Root Access', '2 Dedicated IPs', '1 Gbps Network', 'Priority Support'], popular: true },
      { id: 6, name: 'VPS Elite', price: '₹2,999', processor: 'Intel Xeon E5-2680v4', features: ['8 GB RAM', '200 GB NVMe', '8 vCPU Cores', 'Full Root Access', '3 Dedicated IPs', '10 Gbps Network', '24/7 Premium Support', 'Free Backups'], popular: false }
    ],
    platinum: [
      { id: 7, name: 'VPS Basic', price: '₹1,299', processor: 'Intel Platinum 8280', features: ['4 GB RAM', '75 GB NVMe', '2 vCPU Cores', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network'], popular: false },
      { id: 8, name: 'VPS Pro', price: '₹2,199', processor: 'Intel Platinum 8280', features: ['8 GB RAM', '150 GB NVMe', '4 vCPU Cores', 'Full Root Access', '2 Dedicated IPs', '1 Gbps Network', 'Priority Support'], popular: true },
      { id: 9, name: 'VPS Elite', price: '₹4,299', processor: 'Intel Platinum 8280', features: ['16 GB RAM', '300 GB NVMe', '8 vCPU Cores', 'Full Root Access', '3 Dedicated IPs', '10 Gbps Network', '24/7 Premium Support', 'Free Backups'], popular: false }
    ],
    ryzen: [
      { id: 10, name: 'VPS Basic', price: '₹999', processor: 'AMD Ryzen 9 5950X', features: ['4 GB RAM', '60 GB NVMe', '2 vCPU Cores', 'Full Root Access', '1 Dedicated IP', '1 Gbps Network'], popular: false },
      { id: 11, name: 'VPS Pro', price: '₹1,799', processor: 'AMD Ryzen 9 5950X', features: ['8 GB RAM', '120 GB NVMe', '4 vCPU Cores', 'Full Root Access', '2 Dedicated IPs', '1 Gbps Network', 'Priority Support'], popular: true },
      { id: 12, name: 'VPS Elite', price: '₹3,499', processor: 'AMD Ryzen 9 5950X', features: ['16 GB RAM', '240 GB NVMe', '8 vCPU Cores', 'Full Root Access', '3 Dedicated IPs', '10 Gbps Network', '24/7 Premium Support', 'Free Backups'], popular: false }
    ]
  };

  const PlanCard = ({ plan, index, popular }) => (
    <Antigravity>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className={`relative bg-black/50 backdrop-blur-xl border ${popular ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-white/10'
          } rounded-2xl p-8 hover:bg-white/5 transition-all duration-300`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 hover:opacity-100 rounded-2xl transition-opacity`} />
        {popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg shadow-blue-500/30">
            <Star size={14} fill="currentColor" />
            Most Popular
          </div>
        )}

        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
          {plan.processor && <p className="text-sm text-blue-400 mb-3">{plan.processor}</p>}
          <div className="flex items-end justify-center gap-1">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-gray-400 mb-1">/month</span>
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center text-gray-300">
              <Check size={20} className="text-blue-400 mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleOrder(plan.id)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/40 rounded-lg text-white font-semibold transition-all duration-300"
        >
          Get Started
        </button>
      </motion.div>
    </Antigravity>
  );

  return (
    <section id="pricing" ref={ref} className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
            Transparent Pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the perfect plan that scales with your needs. No hidden fees.
          </p>
        </motion.div>

        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">Bot Hosting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {botHostingPlans.map((plan, index) => (
              <PlanCard key={plan.name} plan={plan} index={index} popular={plan.popular} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-8 text-white">VPS Hosting</h3>

          <Tabs defaultValue="xeon" className="w-full" onValueChange={setSelectedProcessor}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-black/50 backdrop-blur-xl border border-white/10 p-1 rounded-lg">
              <TabsTrigger value="xeon" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20">
                Intel Xeon
              </TabsTrigger>
              <TabsTrigger value="platinum" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20">
                Intel Platinum
              </TabsTrigger>
              <TabsTrigger value="ryzen" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20">
                AMD Ryzen
              </TabsTrigger>
            </TabsList>

            {Object.keys(vpsPlans).map((processor) => (
              <TabsContent key={processor} value={processor}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vpsPlans[processor].map((plan, index) => (
                    <PlanCard key={`${processor}-${plan.name}`} plan={plan} index={index} popular={plan.popular} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;