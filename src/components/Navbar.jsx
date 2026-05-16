import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const BOOKING_URL = "/agendar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Cores', href: '#cores' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Galeria', href: '#galeria' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border/50' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <a href="#hero" className="font-heading text-2xl font-bold text-foreground tracking-wide">
              Nails<span className="text-accent">.</span>Studio
            </a>

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-widest uppercase"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground text-sm font-semibold tracking-wider uppercase rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105"
              >
                Agendar Visita
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-foreground p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20">
              <span className="font-heading text-2xl font-bold text-foreground">
                Nails<span className="text-accent">.</span>Studio
              </span>
              <button onClick={() => setMobileOpen(false)} className="text-foreground p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="font-heading text-4xl text-foreground hover:text-accent transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={BOOKING_URL}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 px-10 py-4 bg-primary text-primary-foreground font-semibold tracking-wider uppercase rounded-full text-lg"
              >
                Agendar Visita
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}