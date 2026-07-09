'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from '../lib/ease';
import { CONTACT } from '../config';
import Wordmark from './Wordmark';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-[var(--line)] shadow-[0_8px_30px_-18px_rgba(0,0,0,0.25)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="Sterling Creations Ai — back to top">
          <Wordmark />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[0.8rem] font-medium uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[var(--gold-2)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <a
            href={CONTACT.emailHref}
            className="btn-gold hidden px-5 py-2.5 text-[0.8rem] uppercase tracking-[0.14em] sm:inline-flex"
          >
            Start a Project
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-strong)] md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-[var(--ink)] transition-transform duration-300 ${menuOpen ? 'translate-y-[5.5px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-[var(--ink)] transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-[var(--ink)] transition-transform duration-300 ${menuOpen ? '-translate-y-[5.5px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass overflow-hidden border-b border-[var(--line)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-[0.85rem] font-medium uppercase tracking-[0.2em] text-[var(--ink-2)]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={CONTACT.emailHref}
                onClick={() => setMenuOpen(false)}
                className="btn-gold mb-2 mt-2 px-5 py-3 text-[0.8rem] uppercase tracking-[0.14em]"
              >
                Start a Project
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
