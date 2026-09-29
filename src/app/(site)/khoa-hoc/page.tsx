import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { CourseCard } from '@/components/courses/CourseCard';
import { Reveal } from '@/components/ui/Reveal';
import { COURSE_LEVEL_LABEL, courseLevelLabel } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Khóa học BIM & Revit' };

export default async function CoursesPage({ searchParams }: { searchParams: { level?: string } }) {
  const locale = getServerLocale();
  const t = getDictionary(locale);
  const level = searchParams.level;
  const courses = await db.course.findMany({
    where: { status: 'PUBLISHED', ...(level ? { level: level as never } : {}) },
    orderBy: { createdAt: 'desc' },
    include: { chapters: { include: { _count: { select: { lessons: true } } } } },
  });

  return (
    <div className="pb-24">
      <div className="border-b border-ink-100 bg-ink-950 py-16">
        <div className="container-wide">
          <p className="eyebrow mb-3">{t.courses.pageEyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            {t.courses.pageTitle} <span className="text-accent-500">{t.courses.pageAccent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-ink-300">{t.courses.pageDescription}</p>
        </div>
      </div>

      <div className="container-wide mt-10">
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/khoa-hoc"
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide',
              !level ? 'border-accent-500 bg-accent-500 text-white' : 'border-ink-200 text-ink-500 hover:border-ink-400'
            )}
          >
            {t.courses.allLevels}
          </Link>
          {Object.keys(COURSE_LEVEL_LABEL).map((value) => (
            <Link
              key={value}
              href={`/khoa-hoc?level=${value}`}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide',
                level === value ? 'border-accent-500 bg-accent-500 text-white' : 'border-ink-200 text-ink-500 hover:border-ink-400'
              )}
            >
              {courseLevelLabel(value, locale)}
            </Link>
          ))}
        </div>

        {courses.length === 0 ? (
          <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-500">{t.courses.noResults}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <Reveal key={c.id} delay={(i % 3) * 80}>
                <CourseCard
                  locale={locale}
                  course={{
                    slug: c.slug,
                    title: localized(c.title, c.titleEn, locale),
                    description: localized(c.description, c.descriptionEn, locale),
                    coverImage: c.coverImage,
                    level: c.level,
                    price: c.price,
                    lessonCount: c.chapters.reduce((s, ch) => s + ch._count.lessons, 0),
                  }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
