import React from 'react';
import { motion } from 'framer-motion';

const polishes = [
  { name: 'Paixão', color: 'Vermelho Clássico', src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/7b2fe8e6c_generated_3cc734bd.png', bg: 'from-red-950/40 to-red-900/10' },
  { name: 'Delicadeza', color: 'Rosa Suave', src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/00b28478c_generated_c2beb2e5.png', bg: 'from-pink-950/40 to-pink-900/10' },
  { name: 'Elegância', color: 'Nude Champagne', src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/bfb0a8e78_generated_78a4ca9d.png', bg: 'from-amber-950/40 to-amber-900/10' },
  { name: 'Mistério', color: 'Roxo Profundo', src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/bd5a16842_generated_f5f3ba88.png', bg: 'from-purple-950/40 to-purple-900/10' },
  { name: 'Energia', color: 'Coral Vibrante', src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/537f2b1fa_generated_bb218979.png', bg: 'from-orange-950/40 to-orange-900/10' },
  { name: 'Poder', color: 'Preto Brilhante', src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/eb16dc769_generated_0d2e36b3.png', bg: 'from-slate-950/40 to-slate-900/10' },
];

export default function PolishShowcase() {
  return (
    <section id="cores" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-4">
            Nossa Coleção
          </p>
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            6 cores<br />
            <span className="text-primary italic">irresistíveis</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {polishes.map((polish, i) => (
            <motion.div
              key={polish.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`group relative rounded-3xl bg-gradient-to-b ${polish.bg} border border-border/50 p-6 lg:p-8 flex flex-col items-center cursor-pointer overflow-hidden`}
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-full aspect-[3/4] mb-6">
                <img
                  src={polish.src}
                  alt={polish.name}
                  className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-heading text-xl lg:text-2xl font-semibold text-foreground mb-1 relative z-10">
                {polish.name}
              </h3>
              <p className="text-muted-foreground text-sm tracking-wide relative z-10">
                {polish.color}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}