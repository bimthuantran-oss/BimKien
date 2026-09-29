import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle2, PlayCircle, Lock } from 'lucide-react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { courseLevelLabel } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import { EnrollButton } from '@/components/courses/EnrollButton';
import { CommentSection } from '@/components/comments/CommentSection';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

async function getCourse(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: { lessons: { orderBy: { order: 'asc' } } },
      },
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return {};
  const locale = getServerLocale();
  return {
    title: localized(course.metaTitle || course.title, course.metaTitleEn, locale),
    description: localized(course.metaDescription || course.description, course.metaDescriptionEn, locale),
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course || course.status !== 'PUBLISHED') notFound();

  const locale = getServerLocale();
  const t = getDictionary(locale);
  const session = await auth();
  const enrollment = session?.user
    ? await db.enrollment.findUnique({ where: { userId_courseId: { userId: session.user.id, courseId: course.id } } })
    : null;

  const allLessons = course.chapters.flatMap((c) => c.lessons);
  const firstLesson = allLessons[0];
  const title = localized(course.title, course.titleEn, locale);
  const description = localized(course.description, course.descriptionEn, locale);

  return (
    <article className="pb-24">
      <div className="bg-ink-950 py-14">
        <div className="container-wide grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Badge>{courseLevelLabel(course.level, locale)}</Badge>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-white md:text-4xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-ink-300">{description}</p>
            <p className="mt-4 text-sm text-ink-400">
              {course.chapters.length} {t.courses.chapters} · {allLessons.length} {t.common.lessons}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-card">
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-ink-100">
              {course.coverImage ? <Image src={course.coverImage} alt={title} fill className="object-cover" /> : null}
            </div>
            <p className="mb-4 font-display text-2xl font-extrabold text-ink-900">
              {course.price === 0 ? t.common.free : `${course.price.toLocaleString('vi-VN')}đ`}
            </p>
            {firstLesson ? (
              <EnrollButton
                courseId={course.id}
                firstLessonHref={`/khoa-hoc/${course.slug}/hoc/${firstLesson.id}`}
                initialEnrolled={Boolean(enrollment)}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="container-wide mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink-900">{t.courses.courseContent}</h2>
          <div className="space-y-4">
            {course.chapters.map((chapter, ci) => (
              <div key={chapter.id} className="overflow-hidden rounded-xl border border-ink-100">
                <div className="bg-ink-50 px-5 py-3 font-display font-bold text-ink-900">
                  {t.courses.chapter} {ci + 1}: {localized(chapter.title, chapter.titleEn, locale)}
                </div>
                <ul className="divide-y divide-ink-100">
                  {chapter.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="flex items-center gap-2 text-ink-700">
                        {enrollment ? <PlayCircle size={16} className="text-accent-500" /> : <Lock size={16} className="text-ink-300" />}
                        {localized(lesson.title, lesson.titleEn, locale)}
                      </span>
                      {lesson.durationMin ? (
                        <span className="text-xs text-ink-400">
                          {lesson.durationMin} {t.courses.minutes}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="my-12 border-ink-100" />
          <CommentSection
            courseId={course.id}
            initialComments={course.comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))}
          />
        </div>

        <aside className="h-fit rounded-xl border border-ink-100 bg-ink-50 p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-ink-900">{t.courses.youWillGet}</h3>
          <ul className="space-y-3 text-sm text-ink-600">
            {t.courses.benefits.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent-500" /> {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
}
