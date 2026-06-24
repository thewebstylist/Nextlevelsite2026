'use client';

import { EASE } from '../lib/ease';

import { motion } from 'framer-motion';

const steps = [
  { n: '01', jp: '探', title: 'Discover', body: 'We pressure-test the core fantasy. Pillars, references, and a vertical-slice plan before a line of code.' },
  { n: '02', jp: '型', title: 'Prototype', body: 'Playable in weeks. We chase the fun first, find the feel, and kill ideas that don&apos;t earn their keep.' },
  { n: '03', jp: '鍛', title: 'Forge', body: 'Full production. Art, code and audio struck together and tempered through relentless iteration.' },
  { n: '04', jp: '出', title: 'Ship & Sharpen', body: 'Launch, then live-ops. We support, patch and polish long after the blade leaves our hands.' },
];

export default function ProcessSection() {
  return (
    <section id="process" className="relative py-28 sm:py-40 bg-[var(--bg-2)] border-y border-white/8 overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="font-jp text-[var(--crimson)] text-lg">鍛冶</span>
            <span className="eyebrow text-[var(--ash)]">The Forge · 04</span>
          </div>
          <h2 className="display-lg text-[var(--bone)]">
            From spark to <span className="crimson-text">steel</span>
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-4 gap-10 md:gap-6">
          {/* connecting line */}
          <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[var(--crimson)]/50 to-transparent" />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
              className="relative text-center md:text-left"
            >
              <div className="relative inline-flex md:flex items-center justify-center w-14 h-14 rounded-full border border-[var(--crimson)]/50 bg-[var(--bg)] mb-6 mx-auto md:mx-0">
                <span className="font-jp text-xl text-[var(--crimson)]">{s.jp}</span>
              </div>
              <span className="font-impact text-[var(--crimson)]/40 text-sm tracking-widest">{s.n}</span>
              <h3 className="mt-1 font-impact text-2xl uppercase tracking-wide text-[var(--bone)]">{s.title}</h3>
              <p className="mt-3 text-[var(--ash)] leading-relaxed text-[0.92rem]">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
