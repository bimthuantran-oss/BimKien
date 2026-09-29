'use client';

import Image from 'next/image';
import { ShieldCheck, Sparkles, Users2, Target } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useLocale } from '@/components/providers/LocaleProvider';

const ICONS = [ShieldCheck, Sparkles, Target, Users2];

export function AboutSection() {
  const { t } = useLocale();

  return (
    <section className="py-20 md:py-28">
      <div className="container-wide grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400&auto=format&fit=crop"
            alt="BIMKien team"
            fill
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            eyebrow={t.home.aboutEyebrow}
            title={t.home.aboutTitle}
            accent={t.home.aboutAccent}
            description={t.home.aboutDescription}
          />

          <div className="mt-8 grid grid-cols-2 gap-5">
            {t.home.strengths.map((title, i) => {
              const Icon = ICONS[i];
              return (
                <div key={title} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-semibold text-ink-800">{title}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
