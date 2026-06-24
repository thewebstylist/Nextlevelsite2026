'use client';

const cols = [
  { title: 'Studio', jp: '工房', links: ['About', 'The Clan', 'Careers', 'Press Kit'] },
  { title: 'Works', jp: '作品', links: ['Kurogane', 'Hanabi', 'Yūrei Protocol', 'Ashfall'] },
  { title: 'Craft', jp: '匠', links: ['Game Design', 'Art Direction', 'Engine & Tech', 'Audio'] },
  { title: 'Connect', jp: '連絡', links: ['Twitter / X', 'ArtStation', 'Discord', 'YouTube'] },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-[var(--ink)] overflow-hidden">
      {/* Oversized wordmark */}
      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 pt-20 pb-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <span className="absolute inset-0 rotate-45 border border-[var(--crimson)]/70" />
                <span className="w-1.5 h-1.5 bg-[var(--crimson)] rounded-full" />
              </div>
              <span className="font-impact text-xl tracking-wide">
                RŌN<span className="text-[var(--crimson)]">I</span>N
              </span>
              <span className="font-jp text-[var(--ash)] text-sm">浪人</span>
            </div>
            <p className="text-[var(--ash)] leading-relaxed max-w-xs text-sm">
              An independent game development studio. Masterless by choice, relentless by code.
            </p>
            <a href="#forge" data-cursor className="btn-ghost inline-block mt-7 px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase">
              Start a Project
            </a>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((col) => (
              <div key={col.title}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="eyebrow text-[var(--bone)]">{col.title}</span>
                  <span className="font-jp text-[var(--crimson)]/60 text-xs">{col.jp}</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" data-cursor className="text-[var(--ash)] hover:text-[var(--bone)] text-sm transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="relative select-none pointer-events-none overflow-hidden border-t border-white/8 pt-8">
          <span className="font-impact uppercase block leading-none text-[var(--bone)]/[0.05] text-[clamp(4rem,20vw,18rem)] text-center tracking-tight">
            RŌNIN
          </span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-[var(--ash)] text-xs tracking-wide">
          <span>© {new Date().getFullYear()} RŌNIN Studio. All worlds reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" data-cursor className="hover:text-[var(--bone)] transition-colors">Privacy</a>
            <a href="#" data-cursor className="hover:text-[var(--bone)] transition-colors">Terms</a>
            <span className="font-jp text-[var(--crimson)]/70">天下無双</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
