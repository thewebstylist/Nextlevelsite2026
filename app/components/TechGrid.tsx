'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const techItems = [
  {
    id: 1,
    title: 'Transformer Architecture',
    subtitle: 'Core Engine',
    description: 'Our proprietary sparse attention mechanism enables 10x faster processing with 90% less compute. The architecture that powers it all.',
    icon: '⚙️',
    tags: ['Sparse Attention', 'Multi-Head', 'Flash Attention'],
    color: '#0ea5e9',
    size: 'large',
  },
  {
    id: 2,
    title: 'Multimodal Fusion',
    subtitle: 'Vision + Language',
    description: 'Unified understanding across text, images, audio, and code.',
    icon: '👁️',
    tags: ['Vision', 'Audio', 'Code'],
    color: '#8b5cf6',
    size: 'small',
  },
  {
    id: 3,
    title: 'RLHF Pipeline',
    subtitle: 'Alignment',
    description: 'Constitutional AI training for safe and helpful responses.',
    icon: '🎯',
    tags: ['Safety', 'Alignment'],
    color: '#ec4899',
    size: 'small',
  },
  {
    id: 4,
    title: 'Vector Database',
    subtitle: 'Memory Layer',
    description: 'Billion-scale semantic search in under 1ms. Persistent memory across every session.',
    icon: '🗄️',
    tags: ['ANN Search', 'Embeddings', 'HNSW'],
    color: '#10b981',
    size: 'medium',
  },
  {
    id: 5,
    title: 'Edge Runtime',
    subtitle: 'Distribution',
    description: 'Deploy to 340+ global nodes. Zero cold starts, infinite scale.',
    icon: '🌐',
    tags: ['Edge', 'CDN', 'WebAssembly'],
    color: '#f59e0b',
    size: 'medium',
  },
  {
    id: 6,
    title: 'Observability',
    subtitle: 'Intelligence Stack',
    description: 'Full telemetry on every token.',
    icon: '📊',
    tags: ['Traces', 'Logs'],
    color: '#06b6d4',
    size: 'small',
  },
];

function TechCard({ item, index }: { item: typeof techItems[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  const colSpan = item.size === 'large' ? 'md:col-span-2' : item.size === 'medium' ? 'md:col-span-1' : 'md:col-span-1';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`${colSpan} relative group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative h-full glass rounded-2xl overflow-hidden border transition-all duration-500"
        style={{
          borderColor: hovered ? `${item.color}40` : 'rgba(255,255,255,0.06)',
          boxShadow: hovered
            ? `0 0 40px ${item.color}15, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
            : '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Animated background */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 40% 40%, ${item.color}08, transparent 60%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Scan line on hover */}
        {hovered && (
          <div
            className="absolute left-0 right-0 h-px opacity-30"
            style={{
              background: `linear-gradient(to right, transparent, ${item.color}, transparent)`,
              animation: 'scanLine 2s linear infinite',
            }}
          />
        )}

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 transition-transform duration-300"
                style={{
                  background: `${item.color}20`,
                  border: `1px solid ${item.color}30`,
                  transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                }}
              >
                {item.icon}
              </div>
              <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-1">{item.subtitle}</p>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
            </div>
            <motion.div
              animate={{ rotate: hovered ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/20 text-xl mt-1"
            >
              +
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/40 leading-relaxed mb-4">{item.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors duration-300"
                style={{
                  background: hovered ? `${item.color}15` : 'rgba(255,255,255,0.04)',
                  color: hovered ? item.color : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${hovered ? item.color + '30' : 'transparent'}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Animated corner accent */}
          <div
            className="absolute bottom-0 right-0 w-20 h-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at 100% 100%, ${item.color}10, transparent 70%)`,
              opacity: hovered ? 1 : 0,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function TechGrid() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true });

  return (
    <section id="technology" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#020408]" />
      <div className="absolute inset-0 grid-bg opacity-15" />

      {/* Large decorative circle */}
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 border border-sky-500" />
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-5 border border-violet-500" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border border-sky-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-xs text-sky-300 font-medium tracking-wide uppercase">Technology Stack</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="display-lg text-white max-w-xl"
            >
              The stack behind
              <br />
              <span className="gradient-text">the magic.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm text-white/40 max-w-xs leading-relaxed lg:text-right"
            >
              Six layers of proprietary technology, each one a decade ahead of the competition.
            </motion.p>
          </div>
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techItems.map((item, i) => (
            <TechCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
