'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#0ea5e9', '#8b5cf6', '#ec4899', '#06b6d4'];
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
        color: colors[i % colors.length],
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-40 overflow-hidden">
      {/* Deep atmospheric background */}
      <div className="absolute inset-0 bg-[#020408]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a1f3d_0%,#020408_60%)]" />

      {/* Volumetric light effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20"
        style={{
          background: 'conic-gradient(from 180deg at 50% 0%, #0ea5e9, #8b5cf6, #0ea5e9)',
          filter: 'blur(80px)',
        }}
      />

      {/* Horizontal glow lines */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
      <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-10" />

      <FloatingParticles />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 glass rounded-full px-5 py-2.5 border border-sky-500/20 mb-12"
        >
          <div className="w-2 h-2 rounded-full bg-sky-400" style={{ boxShadow: '0 0 8px #0ea5e9' }} />
          <span className="text-sm text-white/60">Limited Early Access Available</span>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-sm text-sky-400 font-medium">247 spots remaining</span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl text-white mb-6"
        >
          The future is
          <br />
          <span className="gradient-text">designed.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-white/40 max-w-xl mx-auto leading-relaxed mb-12"
        >
          Join the engineers, founders, and visionaries already building with the most powerful AI platform on the planet.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <button className="magnetic-btn group relative px-10 py-5 rounded-full overflow-hidden text-white font-semibold text-base">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-violet-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Start Building Free →</span>
          </button>
          <button className="magnetic-btn px-10 py-5 rounded-full glass border border-white/10 text-white/60 hover:text-white font-medium text-base transition-colors duration-300">
            Talk to Sales
          </button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/25"
        >
          {[
            '✓ No credit card required',
            '✓ SOC2 Type II certified',
            '✓ GDPR compliant',
            '✓ 99.97% uptime SLA',
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </motion.div>

        {/* Decorative rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-white/3"
              style={{ transform: `scale(${i * 0.4})` }}
              animate={{ opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 4, delay: i * 0.8, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
