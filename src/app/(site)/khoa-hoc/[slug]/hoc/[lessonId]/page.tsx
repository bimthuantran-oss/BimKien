import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FileDown, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { getYouTubeEmbedUrl, cn } from '@/lib/utils';
import { LessonCompleteToggle } from '@/components/courses/LessonCompleteToggle';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export default async function LessonPage({ params }: { params: { slug: string; lessonId: string } }) {
  const session = await auth();
  if (!session?.user) redirect(`/dang-nhap?next=/khoa-hoc/${params.slug}/hoc/${params.lessonId}`);

  const locale = getServerLocale();
  const t = getDictionary(locale);

  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: { lessons: { orderBy: { order: 'asc' }, include: { attachments: true } } },
      },
    },
  });
  if (!course) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/khoa-hoc/${course.slug}`);

  const allLessons = course.chapters.flatMap((c) => c.lessons);
  const lesson = allLessons.find((l) => l.id === params.lessonId);
  if (!lesson) notFound();

  const progressList = await db.lessonProgress.findMany({
    where: { userId: session.user.id, lessonId: { in: allLessons.map((l) => l.id) } },
  });
  const completedSet = new Set(progressList.filter((p) => p.completed).map((p) => p.lessonId));
  const progressPct = allLessons.length ? Math.round((completedSet.size / allLessons.length) * 100) : 0;

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = allLessons[currentIndex + 1];

  const embedUrl = lesson.videoUrl ? getYouTubeEmbedUrl(lesson.videoUrl) : null;
  const courseTitle = localized(course.title, course.titleEn, locale);
  const lessonTitle = localized(lesson.title, lesson.titleEn, locale);
  const lessonContent = localized(lesson.content ?? '', lesson.contentEn, locale);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-ink-100 bg-ink-50 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="p-5">
          <Link href={`/khoa-hoc/${course.slug}`} className="text-xs font-semibold text-accent-600 hover:underline">
            ← {courseTitle}
          </Link>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-semibold text-ink-500">
              <span>{t.courses.progress}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-200">
              <div className="h-full bg-accent-500 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <nav className="px-3 pb-6">
          {course.chapters.map((chapter, ci) => (
            <div key={chapter.id} className="mb-2">
              <p className="px-2 py-2 text-xs font-bold uppercase tracking-wide text-ink-400">
                {t.courses.chapter} {ci + 1}: {localized(chapter.title, chapter.titleEn, locale)}
              </p>
              <ul>
                {chapter.lessons.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/khoa-hoc/${course.slug}/hoc/${l.id}`}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-2 py-2 text-sm',
                        l.id === lesson.id ? 'bg-accent-500 text-white' : 'text-ink-600 hover:bg-white'
                      )}
                    >
                      {completedSet.has(l.id) ? (
                        <CheckCircle2 size={15} className={l.id === lesson.id ? 'text-white' : 'text-accent-500'} />
                      ) : (
                        <Circle size={15} className="opacity-50" />
                      )}
                      {localized(l.title, l.titleEn, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="p-6 md:p-10">
        <h1 className="mb-5 font-display text-2xl font-bold text-ink-900">{lessonTitle}</h1>

        {embedUrl ? (
          <div className="mb-8 aspect-video overflow-hidden rounded-xl bg-ink-950">
            <iframe src={embedUrl} className="h-full w-full" allowFullScreen loading="lazy" />
          </div>
        ) : null}

        {lessonContent ? <div className="prose-bim mb-8" dangerouslySetInnerHTML={{ __html: lessonContent }} /> : null}

        {lesson.attachments.length > 0 ? (
          <div className="mb-8">
            <h3 className="mb-3 font-display text-lg font-bold text-ink-900">{t.courses.attachments}</h3>
            <ul className="space-y-2">
              {lesson.attachments.map((a) => (
                <li key={a.id}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-ink-100 px-4 py-3 text-sm font-medium text-ink-700 hover:border-accent-500 hover:text-accent-600"
                  >
                    <FileDown size={16} /> {a.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-100 pt-6">
          <LessonCompleteToggle lessonId={lesson.id} initialCompleted={completedSet.has(lesson.id)} />
          {nextLesson ? (
            <Link href={`/khoa-hoc/${course.slug}/hoc/${nextLesson.id}`} className="btn-outline-dark">
              {t.courses.nextLesson} <ChevronRight size={16} />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
