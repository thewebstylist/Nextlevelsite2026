'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "NexusAI didn't just improve our pipeline — it made our previous stack look like a prototype. The latency alone is worth the switch.",
    author: 'Sarah Chen',
    role: 'CTO, Horizon Labs',
    avatar: 'SC',
    gradient: 'from-sky-500 to-blue-600',
    company: 'Horizon Labs',
  },
  {
    quote: "We've evaluated every major AI platform. Nothing comes close to the combination of speed, accuracy, and developer experience that Nexus delivers.",
    author: 'Marcus Webb',
    role: 'VP of Engineering, Quantum Corp',
    avatar: 'MW',
    gradient: 'from-violet-500 to-purple-600',
    company: 'Quantum Corp',
  },
  {
    quote: "The adaptive intelligence feature alone saved us 6 months of fine-tuning work. It just understood our domain out of the box.",
    author: 'Priya Sharma',
    role: 'Head of AI, Meridian Health',
    avatar: 'PS',
    gradient: 'from-pink-500 to-rose-600',
    company: 'Meridian Health',
  },
  {
    quote: "I've never seen a vendor move this fast. They shipped features we requested within weeks, not roadmap cycles. This is what partnership looks like.",
    author: 'Alex Kim',
    role: 'Founder, Stellar AI',
    avatar: 'AK',
    gradient: 'from-emerald-500 to-teal-600',
    company: 'Stellar AI',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true });

  return (
    <section id="vision" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#020408]" />

      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #ec4899, transparent)', filter: 'blur(100px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border border-emerald-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-300 font-medium tracking-wide uppercase">Social Proof</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="display-lg text-white"
          >
            Trusted by those who
            <br />
            <span className="gradient-text">build the future.</span>
          </motion.h2>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-3xl p-10 md:p-14 border border-white/5 relative overflow-hidden text-center"
              style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}
            >
              {/* Quote mark */}
              <div
                className="absolute top-8 left-10 text-8xl font-serif leading-none opacity-10"
                style={{ color: testimonials[active].gradient.includes('sky') ? '#0ea5e9' : '#8b5cf6' }}
              >
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="text-amber-400 text-lg"
                  >
                    ★
                  </motion.span>
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-white/80 leading-relaxed font-light mb-10 relative z-10">
                &ldquo;{testimonials[active].quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[active].gradient} flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {testimonials[active].avatar}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{testimonials[active].author}</div>
                  <div className="text-xs text-white/40">{testimonials[active].role}</div>
                </div>
              </div>

              {/* Decorative glow */}
              <div
                className="absolute bottom-0 right-0 w-64 h-64 opacity-5 rounded-full"
                style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)', filter: 'blur(40px)' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Testimonial selector cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.button
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              onClick={() => setActive(i)}
              className={`glass rounded-xl p-4 text-left transition-all duration-300 border ${
                active === i
                  ? 'border-white/15 bg-white/5'
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-semibold mb-2`}>
                {t.avatar}
              </div>
              <div className="text-xs font-medium text-white/70">{t.author}</div>
              <div className="text-xs text-white/30">{t.company}</div>

              {active === i && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-4 h-0.5 rounded-full bg-sky-400 mt-2"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
