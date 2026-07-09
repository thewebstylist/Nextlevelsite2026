import Wordmark from './Wordmark';
import { BRAND, LINKS } from '../config';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--panel-2)] transition-colors duration-500">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-5 py-12 sm:flex-row sm:justify-between sm:px-8">
        <a href="#top" aria-label="Back to top">
          <Wordmark compact />
        </a>
        <p className="text-center text-[0.75rem] tracking-[0.08em] text-[var(--muted)]">
          © {new Date().getFullYear()} {BRAND.name} · {BRAND.location} · Crafted by{' '}
          <a
            href={LINKS.webStylist}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] transition-opacity hover:opacity-75"
          >
            The Web Stylist™
          </a>
        </p>
        <a
          href={LINKS.site}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.75rem] uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--gold)]"
        >
          sterlingcreations.ai ↗
        </a>
      </div>
    </footer>
  );
}
