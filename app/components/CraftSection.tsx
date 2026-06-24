'use client';

import { EASE } from '../lib/ease';

import { motion } from 'framer-motion';

type Craft = { title: string; jp: string; body: string; icon: React.ReactNode };

const I = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    {d.split('|').map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

const crafts: Craft[] = [
  { title: 'Game Design', jp: '設計', body: 'Systems, combat and progression tuned by the frame. We prototype fast and cut without mercy.', icon: I('M4 6h16|M4 12h10|M4 18h7|M18 12l3 3-3 3') },
  { title: 'Art Direction', jp: '画', body: 'A defined visual language for every world — mood boards to shippable style guides.', icon: I('M12 3l9 9-9 9-9-9z|M12 8v8|M8 12h8') },
  { title: '3D & Animation', jp: '彫', body: 'Characters, environments and cinematics with weight, silhouette and motion that feels alive.', icon: I('M12 2l9 5v10l-9 5-9-5V7z|M12 12l9-5|M12 12v10|M12 12L3 7') },
  { title: 'Engine & Tech', jp: '技', body: 'Gameplay engineering, tools and performance work across Unreal, Unity and custom tech.', icon: I('M12 8a4 4 0 100 8 4 4 0 000-8z|M12 2v3|M12 19v3|M2 12h3|M19 12h3|M5 5l2 2|M17 17l2 2|M19 5l-2 2|M7 17l-2 2') },
  { title: 'Narrative', jp: '物語', body: 'Worlds, lore and branching story that earns the player&apos;s attention and rewards their memory.', icon: I('M4 5h16v12H8l-4 4z|M8 9h8|M8 13h5') },
  { title: 'Audio & Music', jp: '音', body: 'Adaptive scores, sound design and voice that make the silence between hits matter.', icon: I('M9 18V6l10-2v12|M9 18a3 3 0 11-6 0 3 3 0 016 0z|M19 16a3 3 0 11-6 0 3 3 0 016 0z') },
];

const fade = (i: number) => ({
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: (i % 3) * 0.1 } },
});

export default function CraftSection() {
  return (
    <section id="craft" className="relative py-28 sm:py-40 bg-[var(--bg-2)] border-y border-white/8 overflow-hidden">
      <div className="absolute right-0 top-0 w-[500px] h-[500px] ink-wash" />
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-20 items-end">
          <motion.div
            variants={fade(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="font-jp text-[var(--crimson)] text-lg">匠</span>
              <span className="eyebrow text-[var(--ash)]">The Craft · 03</span>
            </div>
            <h2 className="display-lg text-[var(--bone)]">
              One clan,
              <br />
              <span className="text-outline">every discipline</span>
            </h2>
          </motion.div>
          <motion.p
            variants={fade(1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-4 text-[var(--ash)] leading-relaxed"
          >
            Full-cycle development under one roof. Hire us end-to-end, or embed our
            specialists into your team like a hidden blade.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8 hairline">
          {crafts.map((c, i) => (
            <motion.div
              key={c.title}
              variants={fade(i)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              data-cursor
              className="group relative panel p-9 sm:p-10 hover:bg-[var(--panel)] transition-colors duration-500"
            >
              <div className="flex items-start justify-between">
                <span className="text-[var(--crimson)] group-hover:text-[var(--crimson-bright)] transition-colors">
                  {c.icon}
                </span>
                <span className="font-jp text-3xl text-[var(--bone)]/10 group-hover:text-[var(--bone)]/25 transition-colors">
                  {c.jp}
                </span>
              </div>
              <h3 className="mt-8 font-impact text-2xl uppercase tracking-wide text-[var(--bone)]">
                {c.title}
              </h3>
              <p className="mt-3 text-[var(--ash)] leading-relaxed text-[0.92rem]">{c.body}</p>
              <span className="absolute left-0 bottom-0 h-[3px] w-0 bg-[var(--crimson)] group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
