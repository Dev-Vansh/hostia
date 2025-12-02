import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import Footer from '@/components/Footer';
import { Target, Users, Zap, Shield } from 'lucide-react';

const AboutPage = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide cutting-edge hosting solutions that empower businesses and individuals to achieve their digital goals with reliability and performance.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction above all else, offering 24/7 support and personalized solutions for every client.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly evolving our infrastructure and services to stay ahead of industry trends and technological advancements.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Enterprise-grade security measures to protect your data and ensure business continuity with 99.9% uptime guarantee.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Hostia | Premium Hosting Solutions</title>
        <meta name="description" content="Learn about Hostia and Webool Technology Limited - your trusted partner for premium bot hosting and VPS hosting solutions." />
      </Helmet>

      <main className="relative z-10 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
              About Hostia
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powered by Webool Technology Limited, we're committed to delivering premium hosting solutions with unmatched performance and reliability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Who We Are</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Hostia is a premium hosting service operated by Webool Technology Limited, a registered technology company based in Mumbai, India. We specialize in providing high-performance bot hosting and VPS hosting solutions tailored to meet the diverse needs of developers, businesses, and organizations worldwide.
              </p>
              <p>
                With state-of-the-art infrastructure powered by Intel Xeon, Intel Platinum, and AMD Ryzen processors, we ensure that your applications run smoothly and efficiently. Our commitment to excellence is reflected in our 99.9% uptime guarantee, 24/7 customer support, and enterprise-grade security measures.
              </p>
              <p>
                At Hostia, we believe in building long-term relationships with our clients by providing transparent pricing, reliable service, and continuous innovation. Whether you're hosting a Discord bot, running a web application, or managing enterprise workloads, we have the perfect solution for you.
              </p>
            </div>
          </motion.div>

          <section ref={ref} className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-3xl font-bold text-white text-center mb-12"
            >
              Our Values
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <value.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Company Information</h2>
            <div className="space-y-2 text-gray-300">
              <p className="text-lg">
                <strong className="text-white">Registered Name:</strong> WeebPoll Technologies India Private Limited
              </p>
              <p className="text-lg">
                <strong className="text-white">Location:</strong> Mumbai, India
              </p>
              <p className="text-lg">
                <strong className="text-white">Email:</strong> support@hostia.com | sales@hostia.com
              </p>
              <p className="text-lg">
                <strong className="text-white">Phone:</strong> +91 123 456 7890
              </p>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default AboutPage;