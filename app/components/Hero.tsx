'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../lib/ease';
import { BRAND, CONTACT, HERO_VIDEO_SRC, LINKS } from '../config';
import Aurora from './Aurora';

const stats = [
  { value: '20+', label: 'Years of Award-Winning Design' },
  { value: '75+', label: 'Languages for Video Translation' },
  { value: '∞', label: 'Ai-Amplified Possibilities' },
];

export default function Hero() {
  const [videoOk, setVideoOk] = useState(true);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background: optional video, aurora canvas, veil */}
      <div className="absolute inset-0">
        {HERO_VIDEO_SRC && videoOk && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'var(--hero-veil)' }} />
        <Aurora />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 35%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 70% at 50% 40%, black 35%, transparent 75%)',
          }}
        />
        {/* bottom fade into page background */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(transparent, var(--bg))' }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-20 pt-36 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="eyebrow mb-6"
        >
          {BRAND.location} · Ai-Assisted Content Studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.42 }}
          className="display-xl max-w-[13ch]"
        >
          Next Level <span className="gold-text">Ai&#8209;Assisted</span> Content Creation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.58 }}
          className="mt-7 max-w-[560px] text-[1.05rem] leading-relaxed text-[var(--muted)]"
        >
          Sterling Creations Ai fuses two decades of award-winning design with
          bleeding-edge artificial intelligence — crafting visual brands, copy,
          motion and interactive experiences that captivate and convert.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.72 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href={CONTACT.emailHref}
            className="btn-gold px-8 py-4 text-[0.85rem] uppercase tracking-[0.14em]"
          >
            Start a Project
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a
            href={CONTACT.phoneHref}
            className="btn-ghost px-8 py-4 text-[0.85rem] uppercase tracking-[0.14em]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
            Call {CONTACT.phoneDisplay}
          </a>
        </motion.div>

        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          href={LINKS.site}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-[0.78rem] uppercase tracking-[0.24em] text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
        >
          sterlingcreations.ai ↗
        </motion.a>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.02 }}
          className="mt-16 grid max-w-[720px] grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <div key={s.label} className="card px-6 py-5">
              <div className="font-display text-3xl font-semibold">
                <span className="gold-text">{s.value}</span>
              </div>
              <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[var(--line-strong)] p-1.5">
          <motion.span
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-2 w-1 rounded-full bg-[var(--gold-2)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
