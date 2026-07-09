import Reveal from './Reveal';
import { LINKS } from '../config';

const pillars = [
  {
    title: 'Future-Forward',
    copy: 'Ignited by the discovery of ChatGPT in December 2022, we turn disruption into opportunity — continually evolving to harness bleeding-edge Ai.',
  },
  {
    title: 'Design-First',
    copy: 'Ai is the amplifier, not the artist. Two decades of brand, web and graphic design craft steer every generated pixel and phrase.',
  },
  {
    title: 'Client-Obsessed',
    copy: 'Beautiful and functional in equal measure — every deliverable is built to move your audience and your business forward.',
  },
];

export default function Studio() {
  return (
    <section
      id="studio"
      className="relative border-y border-[var(--line)] bg-[var(--panel-2)] transition-colors duration-500"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 px-5 py-28 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-4">The Studio</p>
            <h2 className="display-lg max-w-[14ch]">
              Our eye is on the <span className="gold-text">future</span>.
            </h2>
            <p className="mt-7 max-w-[520px] text-[1.02rem] leading-relaxed text-[var(--muted)]">
              Sterling Creations Ai is the next-level content studio from The Web
              Stylist — Los Angeles-bred, Pasadena-based, and built on a simple
              belief: artificial intelligence, guided by a seasoned creative eye,
              produces work neither could achieve alone.
            </p>
            <a
              href={LINKS.motion}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-9 px-7 py-3.5 text-[0.8rem] uppercase tracking-[0.16em]"
            >
              See Motion Work ↗
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-5">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={0.1 * i}>
              <div className="card flex gap-5 p-6">
                <span className="font-logo mt-1 shrink-0 text-[0.7rem] text-[var(--gold)]">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--muted)]">
                    {p.copy}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
