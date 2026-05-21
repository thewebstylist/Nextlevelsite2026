'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 15,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-sky-400"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `particleDrift ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a1628_0%,#020408_70%)]" />

      {/* Aurora layers */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #0ea5e9 0%, #8b5cf6 50%, transparent 70%)',
          top: '50%',
          left: '50%',
          animation: 'aurora 25s linear infinite',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 50%, transparent 70%)',
          top: '40%',
          left: '40%',
          animation: 'aurora 35s linear infinite reverse',
          filter: 'blur(80px)',
          animationDelay: '-10s',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, #0ea5e9 50%, transparent 70%)',
          top: '60%',
          left: '60%',
          animation: 'aurora 20s linear infinite',
          filter: 'blur(50px)',
          animationDelay: '-5s',
        }}
      />

      {/* Volumetric light beams */}
      <div
        className="absolute top-0 left-1/4 w-px h-full opacity-10"
        style={{
          background: 'linear-gradient(to bottom, #0ea5e9, transparent)',
          filter: 'blur(20px)',
          width: '200px',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="absolute top-0 left-3/4 w-px h-full opacity-8"
        style={{
          background: 'linear-gradient(to bottom, #8b5cf6, transparent)',
          filter: 'blur(30px)',
          width: '150px',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Horizontal ambient sweep */}
      <div
        className="absolute h-px w-full opacity-20"
        style={{
          top: '50%',
          background: 'linear-gradient(to right, transparent, #0ea5e9, transparent)',
          filter: 'blur(2px)',
        }}
      />

      {/* Corner radials */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-10 rounded-full"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 60%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10 rounded-full"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 60%)', filter: 'blur(40px)' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#020408_100%)] opacity-80" />
    </div>
  );
}

function FloatingCard({ children, delay = 0, className = '', floatClass = '' }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  floatClass?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`glass glass-hover rounded-2xl ${floatClass} ${className}`}
      style={{ animation: `float ${8 + delay * 2}s ease-in-out infinite`, animationDelay: `${-delay * 2}s` }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20, mass: 1 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <AuroraBackground />
      <ParticleField />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="glass rounded-full px-5 py-2.5 flex items-center gap-3 border border-sky-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" style={{ boxShadow: '0 0 8px #0ea5e9', animation: 'particlePulse 2s ease-in-out infinite' }} />
            <span className="text-sm text-white/70 font-medium">
              Introducing <span className="text-sky-400 font-semibold">Nexus 3.0</span> — Now in Beta
            </span>
            <span className="text-white/30">→</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl text-white mb-4"
          >
            Machine Speed.
            <br />
            <span className="gradient-text">Human Soul.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed"
          >
            The AI platform that doesn&apos;t just process — it understands.
            <br className="hidden md:block" />
            Built for those who demand perfection at every layer.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <button className="magnetic-btn px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-600 text-white font-semibold text-base">
            Start Building Free
          </button>
          <button className="magnetic-btn px-8 py-4 rounded-full glass border border-white/10 text-white/70 hover:text-white font-medium text-base transition-colors">
            Watch the Demo
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10">▶</span>
          </button>
        </motion.div>

        {/* 3D floating cards scene */}
        <motion.div
          style={{ rotateX, rotateY, perspective: 1200 }}
          className="relative"
        >
          {/* Center main visualization card */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ translateX, translateY }}
            className="relative mx-auto max-w-3xl"
          >
            <div
              className="glass rounded-3xl overflow-hidden border border-white/10"
              style={{
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Card top bar */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-4">
                  <div className="glass rounded-md h-6 flex items-center px-3">
                    <span className="text-xs text-white/30">nexus.ai/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Neural viz */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <NeuralViz />
                {/* Stats overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                  {[
                    { label: 'Inference Speed', value: '2.4ms', color: 'text-sky-400' },
                    { label: 'Accuracy', value: '99.7%', color: 'text-violet-400' },
                    { label: 'Active Models', value: '1,247', color: 'text-pink-400' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex-1 glass rounded-xl p-3">
                      <div className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-white/30 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating side cards */}
          <FloatingCard
            delay={1.5}
            className="absolute top-0 -left-4 md:-left-20 w-48 p-4 hidden md:block"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-xs">⚡</div>
              <span className="text-xs text-white/60 font-medium">Real-time</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">142<span className="text-sky-400">K</span></div>
            <div className="text-xs text-white/30 mt-1">Requests / second</div>
            <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: '82%' }}
                transition={{ duration: 2, delay: 2 }}
              />
            </div>
          </FloatingCard>

          <FloatingCard
            delay={1.7}
            className="absolute top-0 -right-4 md:-right-20 w-48 p-4 hidden md:block"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs">🧠</div>
              <span className="text-xs text-white/60 font-medium">Intelligence</span>
            </div>
            <div className="space-y-2 mt-2">
              {['Vision', 'Language', 'Reasoning'].map((item, i) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="text-xs text-white/40 w-16">{item}</div>
                  <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${[95, 98, 91][i]}%` }}
                      transition={{ duration: 2, delay: 2 + i * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </FloatingCard>

          <FloatingCard
            delay={1.9}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 p-4 hidden md:block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Model Output</span>
              <span className="text-xs text-sky-400 font-mono">LIVE</span>
            </div>
            <div className="font-mono text-xs text-white/60 leading-relaxed">
              <span className="text-violet-400">&gt; </span>
              <span className="text-white/80">analyzing_pattern</span>
              <span className="text-sky-400">(</span>
              <span className="text-pink-400">&quot;input&quot;</span>
              <span className="text-sky-400">)</span>
              <br />
              <span className="text-violet-400">&gt; </span>
              <span className="text-green-400">✓</span>
              <span className="text-white/50"> confidence: 0.997</span>
              <br />
              <span className="text-violet-400">&gt; </span>
              <span className="text-white/40">rendering output</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >_</motion.span>
            </div>
          </FloatingCard>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="flex flex-col items-center gap-2 mt-24"
        >
          <span className="text-xs text-white/20 tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function NeuralViz() {
  const nodes = [
    { cx: 80, cy: 60 }, { cx: 80, cy: 120 }, { cx: 80, cy: 180 }, { cx: 80, cy: 240 },
    { cx: 240, cy: 40 }, { cx: 240, cy: 100 }, { cx: 240, cy: 160 }, { cx: 240, cy: 220 }, { cx: 240, cy: 270 },
    { cx: 400, cy: 60 }, { cx: 400, cy: 130 }, { cx: 400, cy: 200 }, { cx: 400, cy: 260 },
    { cx: 560, cy: 100 }, { cx: 560, cy: 180 }, { cx: 560, cy: 240 },
    { cx: 700, cy: 140 }, { cx: 700, cy: 200 },
  ];

  const connections = [
    [0, 4], [0, 5], [1, 4], [1, 5], [1, 6], [2, 5], [2, 6], [2, 7], [3, 6], [3, 7], [3, 8],
    [4, 9], [4, 10], [5, 9], [5, 10], [5, 11], [6, 10], [6, 11], [6, 12], [7, 11], [7, 12], [8, 12],
    [9, 13], [9, 14], [10, 13], [10, 14], [11, 14], [11, 15], [12, 15],
    [13, 16], [14, 16], [14, 17], [15, 17],
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 780 300"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id="nodeGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={nodes[from].cx}
            y1={nodes[from].cy}
            x2={nodes[to].cx}
            y2={nodes[to].cy}
            stroke="url(#nodeGrad)"
            strokeWidth="0.8"
            strokeOpacity="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.3, 0.15] }}
            transition={{ duration: 2, delay: i * 0.05, ease: 'easeInOut' }}
          />
        ))}

        {/* Animated pulses along connections */}
        {connections.slice(0, 12).map(([from, to], i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="2"
            fill="#0ea5e9"
            filter="url(#glow)"
            animate={{
              cx: [nodes[from].cx, nodes[to].cx],
              cy: [nodes[from].cy, nodes[to].cy],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i} filter="url(#glow)">
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r="6"
              fill={i % 3 === 0 ? 'url(#nodeGrad)' : i % 3 === 1 ? 'url(#nodeGrad2)' : '#f472b6'}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0.6, 1, 0.6] }}
              transition={{
                scale: { duration: 0.5, delay: i * 0.05 },
                opacity: { duration: 3, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
