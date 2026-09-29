import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { CourseCard } from '@/components/courses/CourseCard';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import type { Locale } from '@/lib/i18n/locale';

export async function FeaturedCourses({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const courses = await db.course.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { chapters: { include: { _count: { select: { lessons: true } } } } },
  });

  if (courses.length === 0) return null;

  return (
    <section className="bg-ink-50 py-20 md:py-28">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t.home.coursesEyebrow}
            title={t.home.coursesTitle}
            accent={t.home.coursesAccent}
            description={t.home.coursesDescription}
          />
          <Link href="/khoa-hoc" className="btn-outline-dark shrink-0">
            {t.common.viewAll} {t.nav.courses.toLowerCase()} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <CourseCard
                locale={locale}
                course={{
                  slug: c.slug,
                  title: localized(c.title, c.titleEn, locale),
                  description: localized(c.description, c.descriptionEn, locale),
                  coverImage: c.coverImage,
                  level: c.level,
                  price: c.price,
                  lessonCount: c.chapters.reduce((sum, ch) => sum + ch._count.lessons, 0),
                }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
