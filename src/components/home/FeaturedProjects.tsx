import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { projectTypeLabel } from '@/lib/constants';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import type { Locale } from '@/lib/i18n/locale';

export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const projects = await db.project.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  if (projects.length === 0) return null;

  return (
    <section className="bg-ink-950 py-20 md:py-28">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t.home.projectsEyebrow}
            title={t.home.projectsTitle}
            accent={t.home.projectsAccent}
            dark
            description={t.home.projectsDescription}
          />
          <Link href="/du-an" className="btn-outline shrink-0">
            {t.common.viewAll} {t.nav.projects.toLowerCase()} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p, i) => {
            const title = localized(p.title, p.titleEn, locale);
            return (
              <Reveal key={p.id} delay={i * 80}>
                <Link
                  href={`/du-an/${p.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-ink-800"
                >
                  {p.coverImage ? (
                    <Image
                      src={p.coverImage}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent-500">
                      {projectTypeLabel(p.projectType, locale)}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-white">{title}</h3>
                    {p.location ? (
                      <p className="mt-1 flex items-center gap-1 text-xs text-ink-300">
                        <MapPin size={12} /> {p.location}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
