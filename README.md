# STERLING CREATIONS Ai — One-Page Site

A modern, dynamic one-page site for **Sterling Creations Ai**
(*Next Level Ai Assisted Client Content Creation*), built with Next.js
(static export), Tailwind CSS v4 and Framer Motion.

**Light theme by default** with a dark/light toggle in the header
(persisted in `localStorage`).

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```

## Deploys

Pushes to `claude/modern-dynamic-site-redesign-4gxt6k` deploy to GitHub Pages
via `.github/workflows/deploy.yml`:
`https://thewebstylist.github.io/Nextlevelsite2026/`

## Customizing the brand

Everything brand-related lives in two places:

- **`app/config.ts`** — contact email/phone, social links, site URL and the
  optional hero background video.
- **`app/globals.css`** — the light/dark color tokens (`--gold-*`, `--bg`,
  `--ink`, …) at the top of the file.

### Hero background video

The hero ships with a built-in animated “aurora” canvas. To use a real
video (e.g. the background video from sterlingcreations.ai), either:

1. Drop the file at **`public/media/hero-bg.mp4`** — it is picked up
   automatically, or
2. Change `HERO_VIDEO_SRC` in `app/config.ts` to any absolute video URL.

If the video is missing or fails to load, the site gracefully falls back
to the animated canvas.

### OG / social preview image

`public/og.png` (1200×630 @2x) is referenced with absolute URLs in
`app/layout.tsx`. If the site moves to a custom domain, update `SITE_URL`
in `app/config.ts` and regenerate/keep the image path.
