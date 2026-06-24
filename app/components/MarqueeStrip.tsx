'use client';

const items = [
  'GAME DESIGN',
  '3D ART',
  'NARRATIVE',
  'ENGINE CRAFT',
  'ORIGINAL IP',
  'CINEMATICS',
  'WORLD BUILDING',
  'SOUND',
];

function Row({ reverse = false }: { reverse?: boolean }) {
  const content = (
    <div className={reverse ? 'marquee-track-rev' : 'marquee-track'}>
      {[...items, ...items].map((it, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="font-impact text-[clamp(1.6rem,3.4vw,3rem)] uppercase text-[var(--bone)]/85 px-7">
            {it}
          </span>
          <span className="text-[var(--crimson)] text-xl">✦</span>
        </span>
      ))}
    </div>
  );
  return <div className="overflow-hidden">{content}</div>;
}

export default function MarqueeStrip() {
  return (
    <div className="relative border-y border-white/8 bg-[var(--bg-2)] py-5 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[var(--bg-2)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[var(--bg-2)] to-transparent" />
      <Row />
    </div>
  );
}
