const items = [
  'Visual Brand Identity',
  'Ai-Enhanced Copywriting',
  'Motion & Video',
  'Interactive Experiences',
  'Content Strategy',
  'Text-to-Video',
  'Video Translation · 75+ Languages',
  'Product Ads & Brand Promos',
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--panel-2)] py-4 transition-colors duration-500">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={i}
            className="mx-6 flex shrink-0 items-center gap-6 whitespace-nowrap text-[0.78rem] uppercase tracking-[0.26em] text-[var(--muted)]"
          >
            {item}
            <span aria-hidden className="text-[var(--brand-2)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
