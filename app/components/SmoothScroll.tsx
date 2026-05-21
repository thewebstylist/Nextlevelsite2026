'use client';

import { useEffect } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: { destroy: () => void; raf: (time: number) => void } | null = null;

    const initLenis = async () => {
      const { default: Lenis } = await import('@studio-freight/lenis');
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      let rafId: number;
      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis?.destroy();
      };
    };

    let cleanup: (() => void) | undefined;
    initLenis().then((c) => { cleanup = c; });

    return () => { cleanup?.(); };
  }, []);

  return <>{children}</>;
}
