import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { db } from '@/lib/db';
import { Reveal } from '@/components/ui/Reveal';
import { PROJECT_TYPES, projectTypeLabel } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Dự án BIM tiêu biểu' };

export default async function ProjectsPage({ searchParams }: { searchParams: { type?: string } }) {
  const locale = getServerLocale();
  const t = getDictionary(locale);
  const type = searchParams.type;
  const projects = await db.project.findMany({
    where: { status: 'PUBLISHED', ...(type ? { projectType: type } : {}) },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-ink-950 pb-24">
      <div className="border-b border-white/5 py-16">
        <div className="container-wide">
          <p className="eyebrow mb-3">{t.projects.pageEyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            {t.projects.pageTitle} <span className="text-accent-500">{t.projects.pageAccent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-ink-300">{t.projects.pageDescription}</p>
        </div>
      </div>

      <div className="container-wide mt-10">
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/du-an"
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide',
              !type ? 'border-accent-500 bg-accent-500 text-white' : 'border-white/15 text-ink-300 hover:border-white/40'
            )}
          >
            {t.common.all}
          </Link>
          {Object.keys(PROJECT_TYPES).map((slug) => (
            <Link
              key={slug}
              href={`/du-an?type=${slug}`}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide',
                type === slug ? 'border-accent-500 bg-accent-500 text-white' : 'border-white/15 text-ink-300 hover:border-white/40'
              )}
            >
              {projectTypeLabel(slug, locale)}
            </Link>
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-ink-300">{t.projects.noResults}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => {
              const title = localized(p.title, p.titleEn, locale);
              return (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <Link
                    href={`/du-an/${p.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-ink-800"
                  >
                    {p.coverImage ? (
                      <Image
                        src={p.coverImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
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
        )}
      </div>
    </div>
  );
}
