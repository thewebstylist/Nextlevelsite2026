'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

// The <html data-theme> attribute is the source of truth (set pre-paint by
// the inline script in layout.tsx); subscribe to it so React stays in sync.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('sc-theme', next);
    } catch {
      /* private mode — theme simply won't persist */
    }
  }, []);

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative inline-flex h-9 w-[64px] shrink-0 items-center rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-1 transition-colors duration-300 hover:border-[var(--brand-2)]"
    >
      {/* Sun */}
      <svg
        viewBox="0 0 24 24"
        className={`absolute left-2 h-4 w-4 transition-opacity duration-300 ${dark ? 'opacity-35' : 'opacity-0'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
      </svg>
      {/* Moon */}
      <svg
        viewBox="0 0 24 24"
        className={`absolute right-2 h-4 w-4 transition-opacity duration-300 ${dark ? 'opacity-0' : 'opacity-35'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>

      {/* Thumb */}
      <span
        className={`relative z-10 grid h-7 w-7 place-items-center rounded-full text-white transition-transform duration-300 ${dark ? 'translate-x-[28px]' : 'translate-x-0'}`}
        style={{
          background:
            'linear-gradient(135deg, var(--brand-1), var(--brand-2) 55%, var(--brand-3))',
        }}
      >
        {dark ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
          </svg>
        )}
      </span>
    </button>
  );
}
