import { BRAND } from '../config';

export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* Monogram */}
      <span
        aria-hidden
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl"
        style={{
          background:
            'linear-gradient(135deg, var(--gold-1), var(--gold-2) 55%, var(--gold-3))',
          boxShadow: '0 6px 18px -6px rgba(163,122,40,.55)',
        }}
      >
        <span className="font-logo text-[0.95rem] leading-none text-[#17130a] !tracking-normal">
          S
        </span>
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-logo text-[0.78rem] text-[var(--ink)] sm:text-[0.85rem]">
          {BRAND.wordmark.primary}
          <span className="gold-text"> {BRAND.wordmark.secondary}</span>
          <span className="ml-1.5 align-top text-[0.6em] text-[var(--gold)]">
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
