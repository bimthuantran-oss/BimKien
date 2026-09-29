import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { SiteSettings } from '@/lib/settings';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import type { Locale } from '@/lib/i18n/locale';

export function Hero({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const t = getDictionary(locale);
  const titleLine1 = localized(settings.heroTitleLine1 ?? '', settings.heroTitleLine1En, locale);
  const titleLine2 = localized(settings.heroTitleLine2 ?? '', settings.heroTitleLine2En, locale);
  const subtitle = localized(settings.heroSubtitle ?? '', settings.heroSubtitleEn, locale);

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <Image
          src={
            settings.heroImage ||
            'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop'
          }
          alt="BIM model"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="absolute inset-0 bg-grid-fade" />
      </div>

      <div className="container-wide relative flex min-h-[640px] flex-col justify-center py-24 md:min-h-[720px]">
        <p className="eyebrow mb-4 animate-fade-in">{t.home.heroEyebrow}</p>
        <h1 className="max-w-3xl animate-fade-up font-display text-4xl font-extrabold leading-[1.08] text-white text-balance sm:text-5xl md:text-6xl">
          {titleLine1} <br />
          <span className="text-accent-500">{titleLine2}</span>
        </h1>
        <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-ink-200 md:text-lg" style={{ animationDelay: '150ms' }}>
          {subtitle}
        </p>
        <div className="mt-9 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Link href="/khoa-hoc" className="btn-primary">
            {t.common.exploreCourses} <ArrowRight size={16} />
          </Link>
          <Link href="/du-an" className="btn-outline">
            {t.common.viewProjects}
          </Link>
        </div>
      </div>
    </section>
  );
}
