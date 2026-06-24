'use client';

import { EASE } from '../lib/ease';

import { motion } from 'framer-motion';

const quotes = [
  {
    q: 'Kurogane is the most confident combat we&apos;ve felt in years — every strike lands like a verdict.',
    by: 'EDGE',
    role: 'Cover Feature',
    big: true,
  },
  { q: 'A studio that treats restraint as a superpower.', by: 'Polygon', role: 'Studio Profile' },
  { q: 'Hanabi made me cry in a tutorial. Astonishing craft.', by: 'IGN', role: '9.4 / 10' },
  { q: 'RŌNIN punches so far above their size it&apos;s almost unfair.', by: 'Eurogamer', role: 'Recommended' },
  { q: 'The rare team that ships art, not just product.', by: 'GameSpot', role: 'Editor&apos;s Choice' },
];

export default function TestimonialsSection() {
  return (
    <section id="press" className="relative py-28 sm:py-40 overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] ink-wash" />
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="font-jp text-[var(--crimson)] text-lg">評</span>
            <span className="eyebrow text-[var(--ash)]">Acclaim · 05</span>
          </div>
          <h2 className="display-lg text-[var(--bone)]">
            The press has <span className="gold-text">spoken</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((quote, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              data-cursor
              className={`group panel p-8 sm:p-10 relative flex flex-col justify-between hover:bg-[var(--panel)] transition-colors duration-500 ${
                quote.big ? 'md:col-span-2 md:row-span-1' : ''
              }`}
            >
              <span className="font-serif-d text-[var(--crimson)] text-6xl leading-none">&ldquo;</span>
              <p
                className={`mt-2 text-[var(--bone)]/90 leading-snug font-serif-d ${
                  quote.big ? 'text-2xl sm:text-4xl' : 'text-xl'
                }`}
                dangerouslySetInnerHTML={{ __html: quote.q }}
              />
              <footer className="mt-8 flex items-center gap-3">
                <span className="font-impact text-lg uppercase tracking-wide text-[var(--bone)]">{quote.by}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--crimson)]" />
                <span className="text-[var(--ash)] text-xs tracking-[0.15em] uppercase" dangerouslySetInnerHTML={{ __html: quote.role }} />
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
