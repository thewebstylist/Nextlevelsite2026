'use client';

import { EASE } from '../lib/ease';

import { motion } from 'framer-motion';

const tenets = [
  { n: '一', title: 'Craft over noise', body: 'Every frame, line and mechanic is sharpened until it sings. We ship polish, not promises.' },
  { n: '二', title: 'Soul in the systems', body: 'Worlds are felt before they are understood. We design for memory, not just metrics.' },
  { n: '三', title: 'Discipline of the cut', body: 'We remove what does not serve the player. Restraint is our sharpest tool.' },
];

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay } },
});

export default function StudioSection() {
  return (
    <section id="studio" className="relative py-28 sm:py-40 overflow-hidden">
      <div className="absolute -left-40 top-20 w-[520px] h-[520px] ink-wash anim-float" />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-20">
          <motion.div
            variants={fade()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-7">
              <span className="font-jp text-[var(--crimson)] text-lg">工房</span>
              <span className="eyebrow text-[var(--ash)]">The Studio · 01</span>
            </div>
            <h2 className="display-lg text-[var(--bone)]">
              The way of the
              <br />
              <span className="text-outline">masterless</span>
            </h2>
          </motion.div>

          <motion.div
            variants={fade(0.15)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-5"
          >
            <p className="font-serif-d italic text-2xl sm:text-3xl text-[var(--bone)]/90 leading-snug">
              &ldquo;A rōnin answers to no lord — only to the craft itself.&rdquo;
            </p>
            <p className="mt-6 text-[var(--ash)] leading-relaxed">
              We are an independent collective bound by a single code: make games
              that endure. No committees, no filler — just a small clan of
              veterans obsessed with the feel of a perfect moment.
            </p>
          </motion.div>
        </div>

        {/* Tenets */}
        <div className="grid md:grid-cols-3 gap-px bg-white/8 hairline overflow-hidden">
          {tenets.map((t, i) => (
            <motion.div
              key={t.title}
              variants={fade(i * 0.12)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              data-cursor
              className="group relative panel p-9 sm:p-11 hover:bg-[var(--panel)] transition-colors duration-500"
            >
              <span className="font-jp text-5xl text-[var(--crimson)]/30 group-hover:text-[var(--crimson)] transition-colors duration-500">
                {t.n}
              </span>
              <h3 className="mt-6 font-impact text-2xl uppercase text-[var(--bone)] tracking-wide">
                {t.title}
              </h3>
              <p className="mt-4 text-[var(--ash)] leading-relaxed text-[0.95rem]">{t.body}</p>
              <span className="absolute left-0 bottom-0 h-[3px] w-0 bg-[var(--crimson)] group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
