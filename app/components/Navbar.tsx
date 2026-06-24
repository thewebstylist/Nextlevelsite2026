'use client';

import { EASE } from '../lib/ease';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Studio', jp: '工房', href: '#studio' },
  { label: 'Works', jp: '作品', href: '#works' },
  { label: 'Craft', jp: '匠', href: '#craft' },
  { label: 'Forge', jp: '鍛冶', href: '#forge' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/5' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <a href="#top" data-cursor className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-[var(--crimson)]/70 group-hover:rotate-[135deg] transition-transform duration-700" />
            <span className="w-1.5 h-1.5 bg-[var(--crimson)] rounded-full" />
          </div>
          <span className="font-impact text-xl tracking-wide leading-none">
            RŌN<span className="text-[var(--crimson)]">I</span>N
          </span>
          <span className="font-jp text-[var(--ash)] text-sm hidden sm:inline">浪人</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-cursor
              className="group relative text-[0.82rem] font-medium tracking-[0.18em] uppercase text-[var(--bone)]/65 hover:text-[var(--bone)] transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[var(--crimson)] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#forge"
            data-cursor
            className="btn-crimson px-6 py-2.5 text-[0.78rem] font-semibold tracking-[0.16em] uppercase"
          >
            Start a Project
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Menu"
          className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-[5px]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }} className="block w-6 h-px bg-[var(--bone)]" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-6 h-px bg-[var(--bone)]" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }} className="block w-6 h-px bg-[var(--bone)]" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-7 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between text-[var(--bone)]/80 hover:text-white font-medium tracking-[0.18em] uppercase text-sm"
                >
                  {link.label}
                  <span className="font-jp text-[var(--ash)]">{link.jp}</span>
                </motion.a>
              ))}
              <a
                href="#forge"
                onClick={() => setMenuOpen(false)}
                className="btn-crimson mt-2 w-full py-3.5 text-center text-sm font-semibold tracking-[0.16em] uppercase"
              >
                Start a Project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
