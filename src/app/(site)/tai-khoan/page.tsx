import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { PlayCircle } from 'lucide-react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Khóa học của tôi' };

export default async function MyAccountPage() {
  const session = await auth();
  if (!session?.user) redirect('/dang-nhap?next=/tai-khoan');

  const locale = getServerLocale();
  const t = getDictionary(locale);

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    orderBy: { enrolledAt: 'desc' },
    include: {
      course: {
        include: { chapters: { include: { lessons: true } } },
      },
    },
  });

  const progress = await db.lessonProgress.findMany({
    where: { userId: session.user.id, completed: true },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));

  return (
    <div className="container-wide py-16">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink-900">
        {t.account.greeting}, {session.user.name}
      </h1>
      <p className="mb-10 text-ink-500">{t.account.myCoursesDescription}</p>

      {enrollments.length === 0 ? (
        <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-500">
          {t.account.noCourses}{' '}
          <Link href="/khoa-hoc" className="font-semibold text-accent-600 hover:underline">
            {t.account.discoverCourses}
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {enrollments.map((e) => {
            const lessons = e.course.chapters.flatMap((c) => c.lessons);
            const done = lessons.filter((l) => completedSet.has(l.id)).length;
            const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
            const nextLesson = lessons.find((l) => !completedSet.has(l.id)) ?? lessons[0];
            return (
              <div key={e.id} className="flex flex-col gap-4 rounded-xl border border-ink-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-ink-900">{localized(e.course.title, e.course.titleEn, locale)}</h3>
                  <div className="mt-2 h-2 w-full max-w-sm overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full bg-accent-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-400">
                    {pct}% {t.account.completedLabel} · {done}/{lessons.length} {t.common.lessons}
                  </p>
                </div>
                {nextLesson ? (
                  <Link href={`/khoa-hoc/${e.course.slug}/hoc/${nextLesson.id}`} className="btn-primary shrink-0">
                    <PlayCircle size={16} /> {pct === 100 ? t.courses.reviewAgain : t.courses.continueLearning}
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
