import React from 'react';
import { motion } from 'framer-motion';

const BOOKING_URL = "/agendar";

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-accent font-medium tracking-[0.3em] uppercase text-sm mb-6">
            Pronta para brilhar?
          </p>
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[0.95] mb-8">
            Transforme suas unhas em
            <span className="block text-primary">uma obra de arte</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Agende seu horário e descubra por que nossas clientes amam nossos serviços de unhas de gel
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href={BOOKING_URL}
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-4 text-lg font-medium transition-all hover:bg-primary/90 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Agendar Agora
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
