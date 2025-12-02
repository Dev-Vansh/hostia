import React from 'react';
import { Helmet } from 'react-helmet';
import ParticleBackground from '@/components/ParticleBackground';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import PricingSection from '@/components/home/PricingSection';
import WebHostingSection from '@/components/home/WebHostingSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/Footer';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>HOSTIA- Premium Hosting Solutions | Bot & VPS Hosting</title>
        <meta name="description" content="Experience premium bot hosting and VPS hosting solutions with Intel Xeon, Intel Platinum, and AMD Ryzen processors. Powered by Webool Technology Limited." />
      </Helmet>
      <ParticleBackground />
      <main className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <PricingSection />
        <WebHostingSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;