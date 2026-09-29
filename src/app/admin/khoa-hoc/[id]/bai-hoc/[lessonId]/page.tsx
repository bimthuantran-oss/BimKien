import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { LessonForm } from '@/components/admin/LessonForm';

export const metadata = { title: 'Sửa bài học · Admin' };

export default async function EditLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  const lesson = await db.lesson.findUnique({ where: { id: params.lessonId }, include: { attachments: true } });
  if (!lesson) notFound();

  return (
    <div>
      <Link href={`/admin/khoa-hoc/${params.id}`} className="mb-4 inline-block text-sm font-semibold text-accent-600 hover:underline">
        ← Quay lại khóa học
      </Link>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Sửa bài học: {lesson.title}</h2>
      <LessonForm courseId={params.id} lesson={lesson} />
    </div>
  );
}
