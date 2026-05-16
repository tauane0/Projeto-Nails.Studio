import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gem, Palette, Heart } from 'lucide-react';

const BOOKING_URL = "/agendar"; //serve para

// é um
const services = [
  { icon: Sparkles, title: 'Manicure Clássica', description: 'Cuidado completo com cutículas, hidratação e esmaltação impecável com produtos de alta qualidade.', price: 'A partir de R$ 45' },
  { icon: Gem, title: 'Unhas em Gel', description: 'Alongamento e cobertura em gel com durabilidade excepcional e acabamento brilhante como cristal.', price: 'A partir de R$ 120' },
  { icon: Palette, title: 'Nail Art', description: 'Designs exclusivos feitos à mão — desde minimalista elegante até arte detalhada e sofisticada.', price: 'A partir de R$ 80' },
  { icon: Heart, title: 'Spa dos Pés', description: 'Pedicure completa com esfoliação, hidratação profunda e massagem relaxante nos pés.', price: 'A partir de R$ 65' },
];

export default function ServicesSection() {
  return (
    <section id="servicos" className="relative py-32 bg-secondary/50">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <h2 className="font-heading text-5xl font-bold text-foreground">Feitos para encantar</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {services.map((service) => (
            <div key={service.title} className="bg-card rounded-3xl border p-8">
              <service.icon className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <span className="text-accent font-semibold">{service.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}