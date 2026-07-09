import Reveal from './Reveal';

const services = [
  {
    title: 'Visual Brand Identity',
    copy: 'A comprehensive visual language for your brand — logos, imagery and art direction, amplified by Ai-assisted design workflows.',
    icon: (
      <path d="M12 2l2.4 6.2L21 9.3l-5 4.3 1.6 6.4L12 16.6 6.4 20l1.6-6.4-5-4.3 6.6-1.1L12 2z" />
    ),
  },
  {
    title: 'Ai-Enhanced Copywriting',
    copy: 'Compelling about sections, service offerings and product descriptions — persuasive, on-brand text that converts readers into clients.',
    icon: (
      <path d="M4 20h16M6 16L16.5 5.5a2.1 2.1 0 0 1 3 3L9 19l-4 1 1-4z" />
    ),
  },
  {
    title: 'Motion & Video',
    copy: 'Text-to-video and image-to-video creation for product ads, brand promos and cinematic content that stops the scroll.',
    icon: (
      <>
        <rect x="2" y="5" width="15" height="14" rx="2" />
        <path d="M17 9.5l5-3v11l-5-3v-5z" />
      </>
    ),
  },
  {
    title: 'Interactive Experiences',
    copy: 'Immersive, Ai-designed interactive content that captivates users and invites them to engage with your brand.',
    icon: (
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M3 15v4a2 2 0 0 0 2 2h4M13 13l4 8-2.5-1L13 22l-2-6.5L13 13z" />
    ),
  },
  {
    title: 'Content Strategy & Production',
    copy: 'Blog and YouTube pipelines with attention-grabbing titles, SEO-optimized descriptions and engaging scripts that drive visibility.',
    icon: (
      <path d="M3 3v18h18M7 14l4-4 3 3 5-6" />
    ),
  },
  {
    title: 'Video Translation',
    copy: 'Your message in 75+ languages — advanced Ai voice and video translation that preserves your original tone and inflection.',
    icon: (
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-18c2.5 2.4 3.9 5.6 3.9 9s-1.4 6.6-3.9 9c-2.5-2.4-3.9-5.6-3.9-9s1.4-6.6 3.9-9zM3.5 9h17M3.5 15h17" />
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-[1280px] px-5 py-28 sm:px-8">
      <Reveal>
        <p className="eyebrow mb-4">What We Create</p>
        <h2 className="display-lg max-w-[16ch]">
          Every medium. One <span className="gold-text">next-level</span> standard.
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={0.08 * (i % 3)}>
            <div className="card group h-full p-7">
              <span
                className="mb-6 grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
                style={{ background: 'var(--gold-soft)' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-[var(--gold)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </span>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.94rem] leading-relaxed text-[var(--muted)]">
                {s.copy}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
