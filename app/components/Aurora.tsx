'use client';

import { useEffect, useRef } from 'react';

type Blob = {
  x: number; y: number; r: number;
  dx: number; dy: number;
  hueMix: number; // 0..1 blend between pink and blue
};

type Particle = {
  x: number; y: number; r: number;
  vx: number; vy: number; tw: number;
};

/**
 * Theme-aware animated "aurora + drifting particles" canvas.
 * Reads the brand tokens off the root element so it adapts when the
 * light/dark toggle flips, and respects prefers-reduced-motion.
 */
export default function Aurora({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let pink = '#ff2bd6';
    let blue = '#2fb6ff';
    let dark = false;

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      pink = cs.getPropertyValue('--brand-1').trim() || pink;
      blue = cs.getPropertyValue('--brand-3').trim() || blue;
      dark = document.documentElement.getAttribute('data-theme') === 'dark';
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    readTheme();
    resize();

    const blobs: Blob[] = Array.from({ length: 5 }, (_, i) => ({
      x: (0.15 + 0.7 * Math.random()) * w,
      y: (0.1 + 0.75 * Math.random()) * h,
      r: 180 + Math.random() * 260,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.28,
      hueMix: i % 2 === 0 ? 1 : 0.35,
    }));

    const particles: Particle[] = Array.from({ length: 46 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.08 - Math.random() * 0.3,
      tw: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.004;
      ctx.clearRect(0, 0, w, h);

      // aurora blobs
      for (const b of blobs) {
        b.x += b.dx + Math.sin(t + b.r) * 0.18;
        b.y += b.dy + Math.cos(t * 0.8 + b.r) * 0.14;
        if (b.x < -b.r) b.x = w + b.r * 0.5;
        if (b.x > w + b.r) b.x = -b.r * 0.5;
        if (b.y < -b.r) b.y = h + b.r * 0.5;
        if (b.y > h + b.r) b.y = -b.r * 0.5;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const core = b.hueMix > 0.6 ? pink : blue;
        g.addColorStop(0, `${core}${dark ? '2e' : '30'}`);
        g.addColorStop(1, `${core}00`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // drifting particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;

        const a = 0.18 + Math.abs(Math.sin(p.tw)) * (dark ? 0.5 : 0.35);
        ctx.fillStyle = `${blue}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // Single static frame — still branded, no motion.
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: 'var(--aurora-opacity)' }}
    />
  );
}
