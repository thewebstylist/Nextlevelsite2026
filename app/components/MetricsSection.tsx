'use client';

import { EASE } from '../lib/ease';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

type Stat = { value: number; suffix: string; label: string; jp: string };

const stats: Stat[] = [
  { value: 11, suffix: ' yrs', label: 'Forging worlds', jp: '歴' },
  { value: 9, suffix: '', label: 'Titles shipped', jp: '作' },
  { value: 18, suffix: 'M+', label: 'Players reached', jp: '人' },
  { value: 27, suffix: '', label: 'Awards & nominations', jp: '賞' },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="font-impact tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export default function MetricsSection() {
  return (
    <section id="metrics" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 paper-grid opacity-40" />
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 hairline">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="relative panel p-8 sm:p-12 text-center sm:text-left group"
            >
              <span className="absolute top-5 right-5 font-jp text-3xl text-[var(--crimson)]/25 group-hover:text-[var(--crimson)]/60 transition-colors">
                {s.jp}
              </span>
              <div className="text-[clamp(2.8rem,6vw,5rem)] leading-none text-[var(--bone)]">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-4 text-[var(--ash)] text-sm tracking-[0.12em] uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
