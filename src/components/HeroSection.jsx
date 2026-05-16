import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../lib/utils";

const BOOKING_URL = "/agendar";

const POLISHES = [
  {
    src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/00b6158fd_generated_image.png',
    color: '#8B1A2E',
    colorRgb: [139, 26, 46],
    name: 'Paixão',
    label: 'Vermelho Clássico',
  },
  {
    src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/91e630d81_generated_image.png',
    color: '#C45E7A',
    colorRgb: [196, 94, 122],
    name: 'Delicadeza',
    label: 'Rosa Coral',
  },
  {
    src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/481aece67_generated_image.png',
    color: '#5A2466',
    colorRgb: [90, 36, 102],
    name: 'Mistério',
    label: 'Roxo Profundo',
  },
  {
    src: 'https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/47fb4096c_generated_image.png',
    color: '#9C7A5A',
    colorRgb: [156, 122, 90],
    name: 'Elegância',
    label: 'Nude Champagne',
  },
];

// ─── Canvas Líquido Viscoso + Partículas ────────────────────────────────────────
function LiquidCanvas({ activeIdx }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    currentRgb: [...POLISHES[0].colorRgb],
    targetRgb: [...POLISHES[0].colorRgb],
    blobs: [],
    particles: [],
    t: 0,
  });

  // auxiliar lerp
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpRgb = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));

  useEffect(() => {
    stateRef.current.targetRgb = [...POLISHES[activeIdx].colorRgb];
  }, [activeIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // ── Bolhas (pools de líquido estilo metaball) ──
    const initBlobs = () => {
      const count = 8;
      stateRef.current.blobs = Array.from({ length: count }, (_, i) => ({
        x: (Math.random() * 0.8 + 0.1) * W(),
        y: (Math.random() * 0.8 + 0.1) * H(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: W() * (0.15 + Math.random() * 0.22),
        phase: Math.random() * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.003,
        alpha: 0.07 + Math.random() * 0.12,
        shimmer: Math.random() * Math.PI * 2,
      }));
    };

    // ── Partículas flutuantes (gotas) ──
    const spawnParticle = () => ({
      x: Math.random() * W(),
      y: H() + 20,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(0.3 + Math.random() * 0.7),
      r: 2 + Math.random() * 6,
      alpha: 0.6 + Math.random() * 0.4,
      life: 1,
      decay: 0.002 + Math.random() * 0.003,
      shimmer: Math.random() * Math.PI * 2,
    });

    initBlobs();
    stateRef.current.particles = Array.from({ length: 30 }, spawnParticle);

    const draw = () => {
      const s = stateRef.current;
      s.t += 1;

      // Interpolação de cor
      s.currentRgb = lerpRgb(s.currentRgb, s.targetRgb, 0.018);
      const [r, g, b] = s.currentRgb.map(Math.round);

      ctx.clearRect(0, 0, W(), H());

      // ── 1. Desenhar bolhas líquidas ──
      s.blobs.forEach((blob, i) => {
        blob.phase += blob.speed;
        blob.shimmer += 0.02;
        // deriva lenta
        blob.x += blob.vx + Math.sin(blob.phase + i * 0.7) * 0.5;
        blob.y += blob.vy + Math.cos(blob.phase * 0.8 + i) * 0.4;
        // envolver
        if (blob.x < -blob.r) blob.x = W() + blob.r;
        if (blob.x > W() + blob.r) blob.x = -blob.r;
        if (blob.y < -blob.r) blob.y = H() + blob.r;
        if (blob.y > H() + blob.r) blob.y = -blob.r;

        const shimmerAlpha = blob.alpha + 0.04 * Math.sin(blob.shimmer);

        // Bolha principal
        const grad = ctx.createRadialGradient(
          blob.x - blob.r * 0.15, blob.y - blob.r * 0.15, 0,
          blob.x, blob.y, blob.r
        );
        grad.addColorStop(0, `rgba(${r},${g},${b},${shimmerAlpha + 0.06})`);
        grad.addColorStop(0.35, `rgba(${r},${g},${b},${shimmerAlpha})`);
        grad.addColorStop(0.75, `rgba(${r},${g},${b},${shimmerAlpha * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Destaque especular brilhante
        const specX = blob.x - blob.r * 0.3;
        const specY = blob.y - blob.r * 0.35;
        const specR = blob.r * 0.25;
        const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specR);
        specGrad.addColorStop(0, `rgba(255,255,255,0.18)`);
        specGrad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(specX, specY, specR, 0, Math.PI * 2);
        ctx.fillStyle = specGrad;
        ctx.fill();
      });

      // ── 2. Feixe de luz volumétrico do centro ──
      const cx = W() / 2;
      const cy = H() / 2;
      const beamGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W(), H()) * 0.65);
      beamGrad.addColorStop(0, `rgba(${r},${g},${b},0.12)`);
      beamGrad.addColorStop(0.4, `rgba(${r},${g},${b},0.04)`);
      beamGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.ellipse(cx, cy, W() * 0.6, H() * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // ── 3. Partículas de gotas flutuantes ──
      s.particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.005; // float upward acceleration
        p.life -= p.decay;
        p.shimmer += 0.05;

        if (p.life <= 0 || p.y < -20) {
          s.particles[i] = spawnParticle();
          return;
        }

        const alpha = p.alpha * p.life;
        const pGrad = ctx.createRadialGradient(
          p.x - p.r * 0.3, p.y - p.r * 0.3, 0,
          p.x, p.y, p.r
        );
        pGrad.addColorStop(0, `rgba(255,255,255,${alpha * 0.6})`);
        pGrad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha})`);
        pGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();

        // Pequeno destaque na borda
        ctx.beginPath();
        ctx.arc(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.35})`;
        ctx.fill();
      });

      // ── 4. Sobreposição de onda de seda (elipses esticadas) ──
      for (let w = 0; w < 3; w++) {
        const wx = W() * (0.2 + w * 0.3);
        const wy = H() * 0.85 + Math.sin(s.t * 0.008 + w * 1.2) * 30;
        const wGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, W() * 0.25);
        const wa = 0.06 + 0.03 * Math.sin(s.t * 0.01 + w);
        wGrad.addColorStop(0, `rgba(${r},${g},${b},${wa})`);
        wGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.save();
        ctx.scale(1, 0.35);
        ctx.beginPath();
        ctx.arc(wx, wy / 0.35, W() * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = wGrad;
        ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute', 'inset-0', 'w-full', 'h-full')}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// ─── Tela de Introdução ──────────────────────────────────────────────────────────────
function IntroScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400;
    const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const tick = () => {
      const elapsed = Date.now() - start;
      const raw = Math.min(elapsed / duration, 1);
      const p = Math.round(ease(raw) * 100);
      setProgress(p);
      if (raw < 1) requestAnimationFrame(tick);
      else setTimeout(onComplete, 300);
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <motion.div
      className={cn('fixed', 'inset-0', 'z-[100]', 'flex', 'flex-col', 'items-center', 'justify-center')}
      style={{ background: 'hsl(20 10% 4%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Fundo radial sutil */}
      <div
        className={cn('absolute', 'inset-0')}
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,26,46,0.08) 0%, transparent 70%)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn('relative', 'text-center', 'z-10')}
      >
        <p className={cn('text-xs', 'tracking-[0.5em]', 'uppercase', 'text-muted-foreground', 'mb-4', 'font-body')}>
          Beleza & Sofisticação
        </p>
        <h1 className={cn('font-heading', 'text-6xl', 'sm:text-7xl', 'font-bold', 'text-foreground', 'mb-1', 'tracking-tight')}>
          Nails<span style={{ color: '#C9A96E' }}>.</span>Studio
        </h1>
        <div className={cn('mt-14', 'flex', 'flex-col', 'items-center', 'gap-4')}>
          <div className={cn('relative', 'w-56')}>
            <div className={cn('h-px', 'w-full', 'bg-border')} />
            <motion.div
              className={cn('absolute', 'top-0', 'left-0', 'h-px')}
              style={{ background: '#C9A96E', width: `${progress}%` }}
            />
          </div>
          <motion.p
            key={progress}
            className={cn('font-heading', 'text-6xl', 'font-bold')}
            style={{ color: '#C9A96E' }}
          >
            {progress}
            <span className={cn('text-2xl', 'text-muted-foreground', 'font-body', 'font-normal', 'ml-1')}>%</span>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Herói Principal ─────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [showIntro, setShowIntro] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);

  const handleIntroComplete = useCallback(() => {
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => setHeroReady(true), 80);
    }, 900);
  }, []);

  const startCycle = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % POLISHES.length);
    }, 4000);
  }, []);

  useEffect(() => {
    if (heroReady) startCycle();
    return () => clearInterval(intervalRef.current);
  }, [heroReady, startCycle]);

  const handleSelect = (i) => {
    setActiveIdx(i);
    startCycle();
  };

  const active = POLISHES[activeIdx];

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroScreen key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <section
        id="hero"
        className={cn('relative', 'min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center', 'overflow-hidden')}
        style={{ background: 'hsl(20 10% 4%)' }}
      >
        {/* ── Base escuro profundo ── */}
        <div className={cn('absolute', 'inset-0', 'bg-gradient-to-b', 'from-transparent', 'via-background/40', 'to-background/90', 'z-[1]')} />

        {/* ── Canvas líquido (mesclado) ── */}
        <LiquidCanvas activeIdx={activeIdx} />

        {/* ── Imagem de textura de fundo estática ── */}
        <div
          className={cn('absolute', 'inset-0', 'opacity-20')}
          style={{
            backgroundImage: `url(https://media.base44.com/images/public/69f0b691b933e5b671e14cd4/059c90448_generated_image.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />

        {/* ── Vignette ── */}
        <div
          className={cn('absolute', 'inset-0', 'z-[2]', 'pointer-events-none')}
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(6,3,4,0.85) 100%)',
          }}
        />

        {/* ── Main content ── */}
        <div className={cn('relative', 'z-[10]', 'w-full', 'max-w-7xl', 'mx-auto', 'px-5', 'lg:px-10', 'pt-28', 'pb-16', 'flex', 'flex-col', 'items-center')}>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={cn('text-xs', 'sm:text-sm', 'font-medium', 'tracking-[0.45em]', 'uppercase', 'mb-6')}
            style={{ color: '#C9A96E' }}
          >
            Beleza & Sofisticação
          </motion.p>

          {/* Título principal — grande editorial */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={heroReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className={cn('font-heading', 'font-bold', 'text-center', 'leading-[0.88]', 'text-foreground', 'mb-10')}
          >
            <span className="block" style={{ fontSize: 'clamp(3.2rem, 9.5vw, 8.5rem)' }}>Suas unhas</span>
            <span
              className={cn('block', 'italic')}
              style={{ fontSize: 'clamp(3.2rem, 9.5vw, 8.5rem)', color: active.color, transition: 'color 0.8s ease' }}
            >
              merecem
            </span>
            <span className="block" style={{ fontSize: 'clamp(3.2rem, 9.5vw, 8.5rem)' }}>perfeição</span>
          </motion.h1>

          {/* ── Bottle showcase ── */}
          <div
            className={cn('relative', 'w-full', 'flex', 'items-end', 'justify-center', 'mb-8')}
            style={{ height: 'clamp(240px, 36vw, 500px)', gap: 'clamp(12px, 3vw, 48px)' }}
          >
            {POLISHES.map((polish, i) => {
              const isActive = i === activeIdx;
              const diff = i - activeIdx;
              return (
                <motion.button
                  key={polish.name}
                  onClick={() => handleSelect(i)}
                  className={cn('relative', 'flex-shrink-0', 'focus:outline-none')}
                  style={{ width: 'clamp(70px, 12vw, 175px)' }}
                  animate={{
                    scale: isActive ? 1 : 0.65,
                    opacity: isActive ? 1 : 0.38,
                    y: isActive ? 0 : 50,
                    rotate: diff === 0 ? 0 : diff < 0 ? -10 : 10,
                    filter: isActive ? 'brightness(1) saturate(1)' : 'brightness(0.5) saturate(0.5)',
                  }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  initial={false}
                >
                  {/* Glow under active bottle */}
                  {isActive && (
                    <motion.div
                      layoutId="bottleGlow"
                      className={cn('absolute', '-bottom-4', 'left-1/2', '-translate-x-1/2', 'rounded-full', 'blur-2xl')}
                      style={{
                        width: '85%',
                        height: 60,
                        background: polish.color,
                        opacity: 0.65,
                      }}
                    />
                  )}

                  {/* Rim light effect */}
                  {isActive && (
                    <div
                      className={cn('absolute', 'inset-0', 'rounded-xl', 'pointer-events-none', 'z-10')}
                      style={{
                        boxShadow: `0 0 60px 8px ${polish.color}55, inset 0 0 20px ${polish.color}22`,
                      }}
                    />
                  )}

                  <img
                    src={polish.src}
                    alt={polish.name}
                    className={cn('w-full', 'h-auto', 'relative', 'z-[1]')}
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 25px 50px ${polish.color}88) drop-shadow(0 0 15px ${polish.color}44)`
                        : 'none',
                    }}
                  />
                </motion.button>
              );
            })}

            {/* Center volumetric glow */}
            <div
              className={cn('absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'pointer-events-none')}
              style={{
                width: '45%',
                height: '70%',
                background: `radial-gradient(ellipse, ${active.color}18 0%, transparent 70%)`,
                transition: 'background 0.8s ease',
                filter: 'blur(30px)',
              }}
            />
          </div>

          {/* Color name + label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className={cn('text-center', 'mb-7')}
            >
              <p className={cn('font-heading', 'text-3xl', 'sm:text-4xl', 'font-semibold', 'text-foreground')}>
                {active.name}
              </p>
              <p className={cn('text-muted-foreground', 'text-sm', 'tracking-[0.35em]', 'uppercase', 'mt-1')}>
                {active.label}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className={cn('flex', 'gap-3', 'mb-10')}>
            {POLISHES.map((p, i) => (
              <button key={i} onClick={() => handleSelect(i)} className={cn('focus:outline-none', 'py-1')}>
                <motion.div
                  animate={{
                    width: i === activeIdx ? 32 : 8,
                    opacity: i === activeIdx ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.4 }}
                  className={cn('h-2', 'rounded-full')}
                  style={{ background: p.color }}
                />
              </button>
            ))}
          </div>

          {/* CTA button */}
          <motion.a
            href={BOOKING_URL}
            initial={{ opacity: 0, y: 24 }}
            animate={heroReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className={cn('inline-flex', 'items-center', 'gap-3', 'px-10', 'py-5', 'font-semibold', 'tracking-[0.15em]', 'uppercase', 'rounded-full', 'text-sm', 'transition-all', 'duration-300')}
            style={{
              background: `linear-gradient(135deg, ${active.color}dd, ${active.color}99)`,
              color: '#fff',
              boxShadow: `0 8px 40px ${active.color}55, 0 2px 10px rgba(0,0,0,0.4)`,
              transition: 'background 0.8s ease, box-shadow 0.8s ease',
              border: `1px solid ${active.color}66`,
            }}
          >
            <svg viewBox="0 0 24 24" className={cn('w-5', 'h-5', 'fill-current', 'flex-shrink-0')}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Agendar Visita
          </motion.a>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={heroReady ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
          className={cn('absolute', 'bottom-8', 'left-1/2', '-translate-x-1/2', 'z-10')}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className={cn('w-6', 'h-10', 'border', 'border-muted-foreground/25', 'rounded-full', 'flex', 'justify-center', 'pt-2')}
          >
            <div className={cn('w-1.5', 'h-1.5', 'rounded-full')} style={{ background: '#C9A96E' }} />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}