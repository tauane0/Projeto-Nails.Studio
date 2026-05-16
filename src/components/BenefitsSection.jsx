import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Award, Leaf } from 'lucide-react';

const benefits = [
  { icon: Shield, label: 'Produtos Premium', desc: 'Esmaltes e materiais de marcas internacionais reconhecidas' },
  { icon: Clock, label: 'Longa Duração', desc: 'Técnicas que garantem até 3 semanas sem lascar' },
  { icon: Award, label: 'Profissional Certificada', desc: 'Anos de experiência e especializações internacionais' },
  { icon: Leaf, label: 'Cruelty Free', desc: 'Produtos livres de crueldade animal e veganos' },
];

export default function BenefitsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10]">
              <img
                src="https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/2b3c701ec_generated_609ac562.png"
                alt="Mãos com manicure perfeita"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Stats overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-8 -right-4 lg:right-8 bg-card border border-border rounded-2xl p-6 shadow-2xl"
            >
              <div className="text-center">
                <p className="font-heading text-4xl font-bold text-accent">+2.500</p>
                <p className="text-muted-foreground text-sm mt-1">Clientes satisfeitas</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-4">
              Por que nos escolher
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-12">
              Qualidade que
              <br />
              <span className="text-primary italic">se vê</span>
            </h2>

            <div className="space-y-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex gap-5"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-foreground mb-1">
                      {benefit.label}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}