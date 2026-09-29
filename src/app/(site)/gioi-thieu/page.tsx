import Image from 'next/image';
import type { Metadata } from 'next';
import { ShieldCheck, Sparkles, Users2, Target } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatsBar } from '@/components/home/StatsBar';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Về chúng tôi' };

const ICONS = [ShieldCheck, Sparkles, Target, Users2];

export default function AboutPage() {
  const locale = getServerLocale();
  const t = getDictionary(locale);

  return (
    <div>
      <div className="relative overflow-hidden bg-ink-950 py-24">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop"
            alt="BIMKien"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-ink-950/60" />
        </div>
        <div className="container-wide relative">
          <p className="eyebrow mb-3">{t.about.pageEyebrow}</p>
          <h1 className="max-w-2xl font-display text-4xl font-extrabold text-white md:text-5xl">
            {t.about.heroTitle} <span className="text-accent-500">{t.about.heroAccent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-ink-300">{t.about.heroDescription}</p>
        </div>
      </div>

      <StatsBar />

      <section className="py-20 md:py-28">
        <div className="container-wide grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop"
              alt="BIMKien team"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow={t.about.missionEyebrow}
              title={t.about.missionTitle}
              accent={t.about.missionAccent}
              description={t.about.missionDescription}
            />
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-20 md:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow={t.about.valuesEyebrow}
            title={t.about.valuesTitle}
            accent={t.about.valuesAccent}
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.about.values.map((v, i) => {
              const Icon = ICONS[i];
              return (
                <div key={v.title} className="card-surface p-6 text-center">
                  <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                    <Icon size={24} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-ink-900">{v.title}</h3>
                  <p className="mt-2 text-sm text-ink-500">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
