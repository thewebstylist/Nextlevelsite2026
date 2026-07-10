import { BRAND } from '../config';

/**
 * Recreation of the SC Ai circular badge: neon pink→violet→blue gradient
 * ring with circuit nodes, interlocked SC monogram and a blue "Ai".
 */
export function LogoBadge({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden
      className="shrink-0"
      style={{ filter: 'drop-shadow(0 0 10px rgba(255,43,214,0.35))' }}
    >
      <defs>
        <linearGradient id="scGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-1)" />
          <stop offset="50%" stopColor="var(--brand-2)" />
          <stop offset="100%" stopColor="var(--brand-3)" />
        </linearGradient>
      </defs>

      {/* ring */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#scGrad)" strokeWidth="3" />
      {/* circuit nodes on the ring */}
      <circle cx="50" cy="5" r="3.4" fill="var(--brand-1)" />
      <circle cx="88.9" cy="72.5" r="3.4" fill="var(--brand-3)" />
      <circle cx="11.1" cy="72.5" r="3.4" fill="var(--brand-2)" />

      {/* SC monogram */}
      <text
        x="48"
        y="63"
        textAnchor="middle"
        fontFamily="var(--font-body), sans-serif"
        fontSize="46"
        fontWeight="800"
        letterSpacing="-3"
        fill="url(#scGrad)"
      >
        SC
      </text>
      {/* Ai */}
      <text
        x="66"
        y="82"
        textAnchor="middle"
        fontFamily="var(--font-body), sans-serif"
        fontSize="17"
        fontWeight="700"
        fill="var(--brand-3)"
      >
        Ai
      </text>
    </svg>
  );
}

export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <LogoBadge size={compact ? 34 : 42} />
      <span className="flex flex-col leading-none">
        <span className="font-logo text-[0.78rem] font-bold text-[var(--ink)] sm:text-[0.85rem]">
          {BRAND.wordmark.primary}
          <span className="brand-text"> {BRAND.wordmark.secondary}</span>
          <span className="ml-1.5 align-top text-[0.6em] text-[var(--brand-3)]">
            {BRAND.wordmark.chip}
          </span>
        </span>
        {!compact && (
          <span className="mt-1 text-[0.56rem] uppercase tracking-[0.3em] text-[var(--muted)]">
            Ai Content Studio
          </span>
        )}
      </span>
    </span>
  );
}
