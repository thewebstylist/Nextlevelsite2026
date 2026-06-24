'use client';

import { EASE } from '../lib/ease';

import { motion } from 'framer-motion';

type Game = {
  title: string;
  kanji: string;
  genre: string;
  year: string;
  status: string;
  blurb: string;
  art: string; // CSS gradient for the key-art scene
  accent: string;
};

const games: Game[] = [
  {
    title: 'Kurogane',
    kanji: '鉄',
    genre: 'Action · Soulslike',
    year: '2025',
    status: 'In Production',
    blurb: 'A lone swordsmith hunts the gods that broke the world. Deliberate, brutal, beautiful combat.',
    art: 'radial-gradient(120% 120% at 70% 20%, #ff5a4d 0%, #8c1019 32%, #1a0608 70%, #070405 100%)',
    accent: '#ff5a4d',
  },
  {
    title: 'Hanabi',
    kanji: '花',
    genre: 'Adventure · Narrative',
    year: '2023',
    status: 'Shipped',
    blurb: 'A painter rebuilds a fading festival town one memory at a time. Hand-drawn, melancholic, warm.',
    art: 'radial-gradient(120% 120% at 30% 30%, #f3dea0 0%, #c9a24b 28%, #5c3a12 64%, #120c06 100%)',
    accent: '#c9a24b',
  },
  {
    title: 'Yūrei Protocol',
    kanji: '幽',
    genre: 'Sci-fi · Stealth',
    year: '2026',
    status: 'Announced',
    blurb: 'Neon-drenched cyber-feudal Tokyo. Hack the dead, ghost the living, never be seen.',
    art: 'radial-gradient(120% 120% at 75% 70%, #4dd0ff 0%, #2a5bff 30%, #14123a 66%, #060410 100%)',
    accent: '#4dd0ff',
  },
  {
    title: 'Ashfall',
    kanji: '灰',
    genre: 'Strategy · Survival',
    year: '2022',
    status: 'Shipped',
    blurb: 'Lead the last clan across a dying volcanic frontier. Every ember spent is a life chosen.',
    art: 'radial-gradient(120% 120% at 40% 80%, #ff8a3d 0%, #b3401a 30%, #3a1206 66%, #0a0504 100%)',
    accent: '#ff8a3d',
  },
];

const fade = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

function GameRow({ game, index }: { game: Game; index: number }) {
  const flip = index % 2 === 1;
  return (
    <motion.article
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-120px' }}
      className="group grid lg:grid-cols-2 gap-8 lg:gap-14 items-center"
    >
      {/* Key art */}
      <div className={`relative ${flip ? 'lg:order-2' : ''}`} data-cursor>
        <div className="relative aspect-[16/10] overflow-hidden hairline">
          <div
            className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            style={{ background: game.art }}
          />
          <div className="absolute inset-0 scanlines opacity-30" />
          {/* giant kanji */}
          <span
            className="absolute -right-4 -bottom-10 font-jp leading-none select-none transition-transform duration-700 group-hover:scale-105"
            style={{ fontSize: 'clamp(10rem,22vw,18rem)', color: 'rgba(7,4,5,0.45)' }}
          >
            {game.kanji}
          </span>
          {/* number */}
          <span className="absolute top-5 left-5 font-impact text-2xl text-[var(--bone)]/80">
            0{index + 1}
          </span>
          {/* status chip */}
          <span
            className="absolute top-5 right-5 text-[0.62rem] tracking-[0.2em] uppercase px-3 py-1.5 backdrop-blur-sm border"
            style={{ borderColor: `${game.accent}66`, color: game.accent, background: 'rgba(0,0,0,0.35)' }}
          >
            {game.status}
          </span>
          {/* hover CTA */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
            <span className="flex items-center gap-2 font-impact text-lg uppercase tracking-wider text-white">
              Enter World
              <span className="text-[var(--crimson-bright)]">→</span>
            </span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className={flip ? 'lg:order-1 lg:pr-6' : 'lg:pl-6'}>
        <div className="flex items-center gap-4 mb-5">
          <span className="font-jp text-2xl" style={{ color: game.accent }}>{game.kanji}</span>
          <span className="text-[var(--ash)] text-xs tracking-[0.25em] uppercase">{game.genre}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--ash)]/50" />
          <span className="text-[var(--ash)] text-xs tracking-[0.25em]">{game.year}</span>
        </div>
        <h3 className="display-md text-[var(--bone)] group-hover:text-white transition-colors">
          {game.title}
        </h3>
        <p className="mt-5 text-[var(--ash)] leading-relaxed max-w-md">{game.blurb}</p>
        <a
          href="#works"
          data-cursor
          className="mt-7 inline-flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase text-[var(--bone)] group/btn"
        >
          <span className="w-8 h-px bg-[var(--crimson)] group-hover/btn:w-12 transition-all" />
          Case Study
        </a>
      </div>
    </motion.article>
  );
}

export default function GamesShowcase() {
  return (
    <section id="works" className="relative py-28 sm:py-40">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-20"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-jp text-[var(--crimson)] text-lg">作品</span>
              <span className="eyebrow text-[var(--ash)]">Selected Works · 02</span>
            </div>
            <h2 className="display-lg text-[var(--bone)]">
              Worlds we have <span className="crimson-text">forged</span>
            </h2>
          </div>
          <p className="text-[var(--ash)] max-w-xs leading-relaxed">
            Four titles. Two original IPs, two co-developed. Each one shipped with
            the same uncompromising edge.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24 sm:gap-32">
          {games.map((g, i) => (
            <GameRow key={g.title} game={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
