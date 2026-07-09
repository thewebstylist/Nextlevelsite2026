import Reveal from './Reveal';
import Aurora from './Aurora';
import { BRAND, CONTACT, LINKS } from '../config';

const socials = [
  {
    label: 'Instagram',
    handle: '@thewebstylist',
    href: LINKS.instagram,
    icon: (
      <>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'YouTube',
    handle: 'The Web Stylist™',
    href: LINKS.youtube,
    icon: (
      <>
        <path d="M22 12s0-3.4-.43-5a2.8 2.8 0 0 0-2-2C17.9 4.6 12 4.6 12 4.6s-5.9 0-7.57.4a2.8 2.8 0 0 0-2 2C2 8.6 2 12 2 12s0 3.4.43 5a2.8 2.8 0 0 0 2 2c1.67.4 7.57.4 7.57.4s5.9 0 7.57-.4a2.8 2.8 0 0 0 2-2c.43-1.6.43-5 .43-5z" />
        <path d="M10 8.8v6.4L15.5 12 10 8.8z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'Behance',
    handle: '@thewebstylist',
    href: LINKS.behance,
    icon: (
      <path d="M3 6.5h5.2c1.8 0 3.1 1 3.1 2.7 0 1.1-.5 1.9-1.5 2.3 1.3.4 2 1.4 2 2.8 0 2-1.5 3.2-3.6 3.2H3V6.5zm2.3 4.4h2.5c.9 0 1.4-.5 1.4-1.2s-.5-1.2-1.4-1.2H5.3v2.4zm0 4.6h2.8c1 0 1.6-.5 1.6-1.4 0-.8-.6-1.3-1.6-1.3H5.3v2.7zM14.5 7.3h5v1.3h-5V7.3zm5.9 6.7h-5.7c.1 1.3 1 2 2.2 2 .9 0 1.6-.4 1.9-1.1h2.4c-.5 1.9-2.2 3-4.3 3-2.7 0-4.6-1.9-4.6-4.6s1.9-4.6 4.5-4.6c2.7 0 4.4 2 4.4 4.7l-.8.6zm-5.7-1.6h3.4c-.1-1.1-.8-1.8-1.7-1.8-1 0-1.6.7-1.7 1.8z" fill="currentColor" stroke="none" />
    ),
  },
  {
    label: 'LinkedIn',
    handle: 'Sterling Williams',
    href: LINKS.linkedin,
    icon: (
      <path d="M6.5 8.8v9.7H3.6V8.8h2.9zM5 4a1.7 1.7 0 1 1 0 3.4A1.7 1.7 0 0 1 5 4zm5.6 4.8v1.3c.6-.9 1.7-1.6 3.3-1.6 2.4 0 4 1.6 4 4.6v5.4H15v-5c0-1.5-.6-2.4-1.9-2.4-1.2 0-2 .8-2 2.4v5H8.2V8.8h2.4z" fill="currentColor" stroke="none" />
    ),
  },
  {
    label: 'The Web Stylist',
    handle: 'thewebstylist.com',
    href: LINKS.webStylist,
    icon: (
      <>
        <circle cx="12" cy="12" r="9.2" />
        <path d="M2.8 12h18.4M12 2.8c2.6 2.5 4 5.7 4 9.2s-1.4 6.7-4 9.2c-2.6-2.5-4-5.7-4-9.2s1.4-6.7 4-9.2z" />
      </>
    ),
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden">
      <Aurora />
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-28 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow mb-4">Contact</p>
          <h2 className="display-lg mx-auto max-w-[15ch]">
            Let&rsquo;s create something <span className="gold-text">next level</span>.
          </h2>
          <p className="mx-auto mt-6 max-w-[480px] text-[1rem] leading-relaxed text-[var(--muted)]">
            Tell us about your brand, your audience and your ambition — we&rsquo;ll
            bring the vision, the craft and the Ai.
          </p>
        </Reveal>

        {/* Primary actions */}
        <Reveal delay={0.12}>
          <div className="mx-auto mt-12 grid max-w-[880px] grid-cols-1 gap-5 sm:grid-cols-2">
            <a href={CONTACT.emailHref} className="card group flex items-center gap-5 p-7">
              <span
                className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl p-3.5 transition-transform duration-500 group-hover:scale-110"
                style={{ background: 'var(--gold-soft)' }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                  <path d="m3 7 9 6.2L21 7" />
                </svg>
              </span>
              <span>
                <span className="block text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Email the Studio
                </span>
                <span className="mt-1 block font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-[var(--gold)]">
                  {CONTACT.email}
                </span>
              </span>
            </a>

            <a href={CONTACT.phoneHref} className="card group flex items-center gap-5 p-7">
              <span
                className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl p-3.5 transition-transform duration-500 group-hover:scale-110"
                style={{ background: 'var(--gold-soft)' }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
              </span>
              <span>
                <span className="block text-[0.7rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                  Call — {CONTACT.phoneNumeric}
                </span>
                <span className="mt-1 block font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-[var(--gold)]">
                  {CONTACT.phoneDisplay}
                </span>
              </span>
            </a>
          </div>
        </Reveal>

        {/* Socials */}
        <Reveal delay={0.2}>
          <div className="mx-auto mt-8 flex max-w-[880px] flex-wrap justify-center gap-3.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center gap-3 rounded-full px-5 py-3"
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[var(--gold)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
                <span className="text-[0.82rem] font-medium">{s.label}</span>
                <span className="hidden text-[0.75rem] text-[var(--muted)] sm:inline">
                  {s.handle}
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <p className="mt-12 text-center text-[0.78rem] uppercase tracking-[0.26em] text-[var(--muted)]">
            {BRAND.location} · Serving clients worldwide
          </p>
        </Reveal>
      </div>
    </section>
  );
}
