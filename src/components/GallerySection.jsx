import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../lib/utils";

const images = [
  { src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/97aa0bf7a_generated_image.png', alt: 'Nail art floral' },
  { src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/3067a6353_generated_bb7ebe38.png', alt: 'Design minimalista' },
  { src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/b47edfef9_generated_e365fdf9.png', alt: 'Unhas burgundy glitter' },
  { src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/8f4462271_generated_486ef62b.png', alt: 'Ombré rosa e branco' },
];

export default function GallerySection() {
  return (
    <section id="galeria" className={cn('relative', 'py-32', 'bg-secondary/30')}>
      <div className={cn('max-w-7xl', 'mx-auto', 'px-6', 'lg:px-10')}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className={cn('text-center', 'mb-20')}
        >
          <p className={cn('text-accent', 'font-medium', 'tracking-[0.3em]', 'uppercase', 'text-sm', 'mb-4')}>
            Nosso Trabalho
          </p>
          <h2 className={cn('font-heading', 'text-5xl', 'sm:text-6xl', 'lg:text-7xl', 'font-bold', 'text-foreground', 'leading-tight')}>
            Galeria de
            <br />
            <span className={cn('text-primary', 'italic')}>inspirações</span>
          </h2>
        </motion.div>

        {/* Masonry-like grid */}
        <div className={cn('grid', 'grid-cols-2', 'lg:grid-cols-4', 'gap-4', 'lg:gap-6')}>
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 ? 'lg:row-span-2 aspect-[3/4] lg:aspect-auto' :
                i === 1 ? 'aspect-square' :
                i === 2 ? 'aspect-square' :
                'lg:row-span-2 aspect-[3/4] lg:aspect-auto'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={cn('w-full', 'h-full', 'object-cover', 'group-hover:scale-110', 'transition-transform', 'duration-700')}
              />
              <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-background/80', 'via-background/0', 'to-transparent', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-500')} />
              <div className={cn('absolute', 'bottom-0', 'left-0', 'right-0', 'p-5', 'translate-y-full', 'group-hover:translate-y-0', 'transition-transform', 'duration-500')}>
                <p className={cn('text-foreground', 'font-heading', 'text-lg', 'font-medium')}>{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}