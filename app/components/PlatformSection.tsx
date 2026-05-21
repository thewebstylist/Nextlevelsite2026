'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const capabilities = [
  {
    icon: '⚡',
    title: 'Hyper-Fast Inference',
    description: 'Sub-2ms response times across all model sizes. Experience AI that thinks at the speed of thought.',
    gradient: 'from-sky-500 to-blue-600',
    glow: 'rgba(14, 165, 233, 0.15)',
    metric: '2.1ms',
    metricLabel: 'avg. latency',
  },
  {
    icon: '🧠',
    title: 'Adaptive Intelligence',
    description: 'Models that learn your domain and adapt in real-time. No fine-tuning required — it just understands.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139, 92, 246, 0.15)',
    metric: '99.7%',
    metricLabel: 'accuracy',
  },
  {
    icon: '🌐',
    title: 'Global Neural Fabric',
    description: '340+ edge nodes worldwide. Your users get the lowest latency, everywhere, always.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'rgba(236, 72, 153, 0.15)',
    metric: '340+',
    metricLabel: 'edge nodes',
  },
  {
    icon: '🔐',
    title: 'Zero-Trust Architecture',
    description: 'Enterprise-grade security with homomorphic encryption. Your data never leaves your perimeter.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16, 185, 129, 0.15)',
    metric: 'SOC2',
    metricLabel: 'certified',
  },
  {
    icon: '♾️',
    title: 'Infinite Context',
    description: 'Process entire codebases, research papers, and conversations with no token limits.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245, 158, 11, 0.15)',
    metric: '∞',
    metricLabel: 'context window',
  },
  {
    icon: '🎯',
    title: 'Precision Workflows',
    description: 'Chain AI actions with deterministic precision. Build complex pipelines that never break.',
    gradient: 'from-cyan-500 to-sky-600',
    glow: 'rgba(6, 182, 212, 0.15)',
    metric: '< 0.1%',
    metricLabel: 'error rate',
  },
];

function CapabilityCard({ cap, index }: { cap: typeof capabilities[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="glass glass-hover rounded-2xl p-6 group cursor-default relative overflow-hidden"
      style={{
        boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.3)`,
        animation: `borderPulse ${4 + index}s ease-in-out infinite`,
      }}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${cap.glow}, transparent 60%)` }}
      />

      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-y-0 w-1/3"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
            animation: 'shimmerSlide 2s ease infinite',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
          {cap.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
          {cap.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/40 leading-relaxed mb-5">
          {cap.description}
        </p>

        {/* Metric */}
        <div className="flex items-end gap-2 pt-4 border-t border-white/5">
          <span className={`text-2xl font-bold font-mono bg-gradient-to-r ${cap.gradient} bg-clip-text text-transparent`}>
            {cap.metric}
          </span>
          <span className="text-xs text-white/30 mb-1">{cap.metricLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function PlatformSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section id="platform" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a1628_0%,#020408_60%)]" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border border-violet-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-xs text-violet-300 font-medium tracking-wide uppercase">Platform Capabilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="display-lg text-white mb-6"
          >
            Engineered for
            <br />
            <span className="gradient-text">the impossible.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-white/40 max-w-xl mx-auto leading-relaxed"
          >
            Every component built to elite tolerances.
            Because when AI meets reality, there&apos;s no room for compromise.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, i) => (
            <CapabilityCard key={cap.title} cap={cap} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
