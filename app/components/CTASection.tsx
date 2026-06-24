'use client';

import { EASE } from '../lib/ease';

import { useState } from 'react';
import { motion } from 'framer-motion';

const projectTypes = ['Original IP', 'Co-Development', 'Art & Cinematics', 'Consulting'];

export default function CTASection() {
  const [type, setType] = useState(projectTypes[0]);
  const [sent, setSent] = useState(false);

  return (
    <section id="forge" className="relative py-28 sm:py-40 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--bg-2)]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] ink-wash anim-float" />
      <div className="absolute inset-0 paper-grid opacity-30" />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left: pitch */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="font-jp text-[var(--crimson)] text-lg">鍛冶</span>
            <span className="eyebrow text-[var(--ash)]">Start a Project · 06</span>
          </div>
          <h2 className="display-lg text-[var(--bone)]">
            Forge your
            <br />
            world <span className="crimson-text">with us</span>
          </h2>
          <p className="mt-7 text-[var(--ash)] text-lg leading-relaxed max-w-md">
            Whether it&apos;s a brand-new IP or a battle that needs reinforcements,
            our blades are for hire. Tell us what you&apos;re building.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <a href="mailto:forge@ronin.studio" data-cursor className="group flex items-center gap-4">
              <span className="w-11 h-11 rounded-full hairline flex items-center justify-center text-[var(--crimson)] group-hover:bg-[var(--crimson)] group-hover:text-white transition-colors">
                ✉
              </span>
              <span className="text-[var(--bone)] group-hover:text-white transition-colors tracking-wide">forge@ronin.studio</span>
            </a>
            <div className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-full hairline flex items-center justify-center text-[var(--crimson)]">⟁</span>
              <span className="text-[var(--ash)] tracking-wide">Kyoto · Berlin · Remote</span>
            </div>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="panel p-8 sm:p-10 relative"
        >
          <span className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[var(--crimson)] to-transparent" />
          {sent ? (
            <div className="py-16 text-center">
              <div className="font-jp text-5xl text-[var(--crimson)] mb-5">了</div>
              <h3 className="font-impact text-2xl uppercase text-[var(--bone)]">Message received</h3>
              <p className="mt-3 text-[var(--ash)]">A rōnin will answer within two sunsets.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="flex flex-col gap-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Name" placeholder="Your name" />
                <Field label="Email" type="email" placeholder="you@studio.com" />
              </div>

              <div>
                <label className="eyebrow text-[var(--ash)] block mb-3">Project Type</label>
                <div className="flex flex-wrap gap-2.5">
                  {projectTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      data-cursor
                      onClick={() => setType(t)}
                      className={`px-4 py-2 text-xs tracking-[0.1em] uppercase border transition-all ${
                        type === t
                          ? 'border-[var(--crimson)] bg-[var(--crimson)]/10 text-[var(--bone)]'
                          : 'border-white/12 text-[var(--ash)] hover:border-white/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="eyebrow text-[var(--ash)] block mb-3">Tell us about it</label>
                <textarea
                  rows={4}
                  required
                  placeholder="The world you want to build…"
                  className="w-full bg-[var(--bg)] border border-white/12 px-4 py-3 text-[var(--bone)] placeholder:text-[var(--ash)]/50 focus:border-[var(--crimson)] focus:outline-none transition-colors resize-none"
                />
              </div>

              <button type="submit" data-cursor className="btn-crimson py-4 text-sm font-semibold tracking-[0.16em] uppercase mt-2">
                Send the Signal
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, type = 'text', placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="eyebrow text-[var(--ash)] block mb-3">{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="w-full bg-[var(--bg)] border border-white/12 px-4 py-3 text-[var(--bone)] placeholder:text-[var(--ash)]/50 focus:border-[var(--crimson)] focus:outline-none transition-colors"
      />
    </div>
  );
}
