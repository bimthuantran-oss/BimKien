'use client';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useLocale } from '@/components/providers/LocaleProvider';

export function ProcessTimeline() {
  const { t } = useLocale();

  return (
    <section className="bg-ink-950 py-20 md:py-28">
      <div className="container-wide">
        <SectionHeading
          eyebrow={t.home.processEyebrow}
          title={t.home.processTitle}
          accent={t.home.processAccent}
          dark
          align="center"
          className="mx-auto"
        />

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 lg:block" />
          {t.home.processSteps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 font-display text-lg font-bold text-white shadow-glow">
                {i + 1}
              </span>
              <h3 className="font-display text-base font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
