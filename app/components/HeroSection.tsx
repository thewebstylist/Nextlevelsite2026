'use client';

import { EASE } from '../lib/ease';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const reveal = {
  hidden: { y: '110%' },
  show: (i: number) => ({
    y: '0%',
    transition: { duration: 1.1, ease: EASE, delay: 0.35 + i * 0.12 },
  }),
};

// Deterministic pseudo-random so server and client markup match (no hydration drift).
const rand = (i: number, salt: number) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Embers() {
  const embers = Array.from({ length: 26 }, (_, i) => ({
    l: rand(i, 1) * 100,
    d: rand(i, 2) * 8,
    s: 1 + rand(i, 3) * 2.5,
    dur: 7 + rand(i, 4) * 9,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-[-20px] rounded-full"
          style={{
            left: `${e.l}%`,
            width: e.s,
            height: e.s,
            background: i % 3 === 0 ? 'var(--gold)' : 'var(--crimson-bright)',
            boxShadow: `0 0 ${e.s * 3}px ${i % 3 === 0 ? 'rgba(201,162,75,0.8)' : 'rgba(255,59,59,0.8)'}`,
            animation: `particleRise ${e.dur}s linear ${e.d}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes particleRise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translateY(-104vh) translateX(30px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const ySun = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex items-center vignette"
    >
      {/* Background layers */}
      <div className="absolute inset-0 paper-grid opacity-60" />
      <div className="absolute inset-0 scanlines opacity-40" />

      {/* Crimson sun / blood moon */}
      <motion.div
        style={{ y: ySun, x: mouse.x * -18, opacity }}
        className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 z-0"
      >
        <div className="relative">
          <div
            className="w-[60vw] h-[60vw] max-w-[680px] max-h-[680px] rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 45%, #ff5a4d 0%, #d61f2b 38%, #8c1019 62%, transparent 72%)',
            }}
          />
          <div className="absolute inset-0 rounded-full anim-flicker" style={{ boxShadow: '0 0 160px 40px rgba(214,31,43,0.35)' }} />
        </div>
      </motion.div>

      {/* Giant kanji watermark */}
      <motion.div
        style={{ x: mouse.x * 22, y: mouse.y * 16 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none"
      >
        <span className="font-jp text-outline-crimson opacity-[0.18] leading-none" style={{ fontSize: 'clamp(16rem, 46vw, 48rem)' }}>
          侍
        </span>
      </motion.div>

      {/* Torii gate silhouette */}
      <motion.svg
        style={{ x: mouse.x * 8 }}
        viewBox="0 0 200 180"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(90vw,760px)] z-0 opacity-[0.5]"
        aria-hidden
      >
        <g fill="#070405">
          <rect x="20" y="40" width="160" height="14" rx="2" />
          <path d="M10 30 H190 L178 44 H22 Z" />
          <rect x="40" y="54" width="12" height="126" />
          <rect x="148" y="54" width="12" height="126" />
          <rect x="30" y="68" width="140" height="9" />
        </g>
      </motion.svg>

      <Embers />

      {/* Side vertical text */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-10">
        <span className="font-jp writing-vertical text-[var(--ash)] text-sm tracking-widest">独立系開発工房</span>
        <span className="w-px h-24 bg-gradient-to-b from-[var(--crimson)] to-transparent" />
      </div>
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-10">
        <span className="text-[var(--ash)] text-[0.7rem] tracking-[0.4em] rotate-90 origin-center whitespace-nowrap mt-10">
          EST. 2014 · KYOTO / BERLIN
        </span>
      </div>

      {/* Main content */}
      <motion.div
        style={{ y: yTitle, opacity }}
        className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-7"
        >
          <span className="w-10 h-px bg-[var(--crimson)]" />
          <span className="eyebrow text-[var(--crimson)]">Independent Game Development Studio</span>
          <span className="w-10 h-px bg-[var(--crimson)]" />
        </motion.div>

        <h1 className="display-xl text-[var(--bone)]" style={{ filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.6))' }}>
          <span className="reveal-line">
            <motion.span custom={0} variants={reveal} initial="hidden" animate="show" className="block">
              WE FORGE
            </motion.span>
          </span>
          <span className="reveal-line">
            <motion.span custom={1} variants={reveal} initial="hidden" animate="show" className="block crimson-text">
              WORLDS
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.9 }}
          className="mt-8 mx-auto max-w-2xl text-[var(--ash)] text-base sm:text-lg leading-relaxed"
        >
          A masterless studio of designers, artists and engineers crafting
          cinematic games with discipline, soul, and a blade&apos;s edge of polish —
          <span className="text-[var(--bone)]"> from first spark to final ship.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.9 }}
          className="mt-11 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#works" data-cursor className="btn-crimson px-9 py-4 text-sm font-semibold tracking-[0.16em] uppercase w-full sm:w-auto">
            View Our Worlds
          </a>
          <a href="#forge" data-cursor className="btn-ghost px-9 py-4 text-sm font-semibold tracking-[0.16em] uppercase w-full sm:w-auto">
            Build With Us
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[0.62rem] tracking-[0.35em] text-[var(--ash)] uppercase">Scroll</span>
        <span className="relative w-5 h-8 rounded-full border border-[var(--ash)]/40 flex justify-center pt-1.5">
          <span className="w-1 h-1.5 rounded-full bg-[var(--crimson)]" style={{ animation: 'scrollHint 1.8s ease-in-out infinite' }} />
        </span>
      </motion.div>
    </section>
  );
}
