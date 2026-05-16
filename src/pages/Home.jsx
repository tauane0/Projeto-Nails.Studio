import React from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroSection from '../components/HeroSection.jsx';
import PolishShowcase from '../components/PolishShowcase.jsx';
import ServicesSection from '../components/ServicesSection.jsx';
import BenefitsSection from '../components/BenefitsSection.jsx';
import GallerySection from '../components/GallerySection.jsx';
import CTASection from '../components/CTASection.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppFloating from '../components/WhatsAppFloating.jsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <PolishShowcase />
      <ServicesSection />
      <BenefitsSection />
      <GallerySection />
      <CTASection />
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}