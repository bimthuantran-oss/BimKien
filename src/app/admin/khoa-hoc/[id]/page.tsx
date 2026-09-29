import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUp, ArrowDown, Trash2, Plus, Pencil } from 'lucide-react';
import { db } from '@/lib/db';
import { CourseForm } from '@/components/admin/CourseForm';
import {
  addChapter,
  renameChapter,
  deleteChapter,
  moveChapter,
  addLesson,
  deleteLesson,
  moveLesson,
} from '@/lib/actions/courses';

export const metadata = { title: 'Quản lý khóa học · Admin' };

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await db.course.findUnique({
    where: { id: params.id },
    include: { chapters: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } } },
  });
  if (!course) notFound();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Thông tin khóa học</h2>
        <CourseForm initial={course} />
      </div>

      <div>
        <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Chương & bài học</h2>

        <div className="space-y-4">
          {course.chapters.map((chapter, ci) => (
            <div key={chapter.id} className="card-surface overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-ink-50 px-5 py-3">
                <form action={renameChapter} className="flex flex-1 flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={chapter.id} />
                  <input type="hidden" name="courseId" value={course.id} />
                  <span className="text-xs font-bold text-ink-400">Chương {ci + 1}</span>
                  <input
                    name="title"
                    defaultValue={chapter.title}
                    placeholder="Tên chương"
                    className="min-w-[140px] flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-bold text-ink-900 hover:border-ink-200 focus:border-accent-500 focus:bg-white focus:outline-none"
                  />
                  <input
                    name="titleEn"
                    defaultValue={chapter.titleEn ?? ''}
                    placeholder="Tên chương (Tiếng Anh)"
                    className="min-w-[140px] flex-1 rounded-md border border-dashed border-accent-200 bg-transparent px-2 py-1 text-sm text-ink-600 focus:border-accent-500 focus:bg-white focus:outline-none"
                  />
                  <button className="text-xs font-semibold text-accent-600 hover:underline">Lưu</button>
                </form>
                <div className="flex items-center gap-1">
                  <form action={moveChapter}>
                    <input type="hidden" name="id" value={chapter.id} />
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button className="rounded-md p-1.5 text-ink-500 hover:bg-white" disabled={ci === 0}>
                      <ArrowUp size={14} />
                    </button>
                  </form>
                  <form action={moveChapter}>
                    <input type="hidden" name="id" value={chapter.id} />
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button className="rounded-md p-1.5 text-ink-500 hover:bg-white" disabled={ci === course.chapters.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                  </form>
                  <form action={deleteChapter}>
                    <input type="hidden" name="id" value={chapter.id} />
                    <input type="hidden" name="courseId" value={course.id} />
                    <button className="rounded-md p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>

              <ul className="divide-y divide-ink-100">
                {chapter.lessons.map((lesson, li) => (
                  <li key={lesson.id} className="flex items-center justify-between gap-3 px-5 py-2.5">
                    <span className="text-sm text-ink-700">{lesson.title}</span>
                    <div className="flex items-center gap-1">
                      <form action={moveLesson}>
                        <input type="hidden" name="id" value={lesson.id} />
                        <input type="hidden" name="chapterId" value={chapter.id} />
                        <input type="hidden" name="courseId" value={course.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button className="rounded-md p-1.5 text-ink-400 hover:bg-ink-50" disabled={li === 0}>
                          <ArrowUp size={13} />
                        </button>
                      </form>
                      <form action={moveLesson}>
                        <input type="hidden" name="id" value={lesson.id} />
                        <input type="hidden" name="chapterId" value={chapter.id} />
                        <input type="hidden" name="courseId" value={course.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button className="rounded-md p-1.5 text-ink-400 hover:bg-ink-50" disabled={li === chapter.lessons.length - 1}>
                          <ArrowDown size={13} />
                        </button>
                      </form>
                      <Link href={`/admin/khoa-hoc/${course.id}/bai-hoc/${lesson.id}`} className="rounded-md p-1.5 text-ink-400 hover:bg-ink-50 hover:text-accent-600">
                        <Pencil size={13} />
                      </Link>
                      <form action={deleteLesson}>
                        <input type="hidden" name="id" value={lesson.id} />
                        <input type="hidden" name="courseId" value={course.id} />
                        <button className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600">
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>

              <form action={addLesson} className="flex items-center gap-2 border-t border-ink-100 px-5 py-3">
                <input type="hidden" name="chapterId" value={chapter.id} />
                <input type="hidden" name="courseId" value={course.id} />
                <input
                  name="title"
                  placeholder="Tên bài học mới..."
                  required
                  className="flex-1 rounded-md border border-ink-200 px-3 py-1.5 text-sm focus:border-accent-500 focus:outline-none"
                />
                <button className="btn-ghost !px-3 !py-1.5 text-xs">
                  <Plus size={14} /> Thêm bài
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={addChapter} className="card-surface mt-4 flex items-center gap-2 p-4">
          <input type="hidden" name="courseId" value={course.id} />
          <input
            name="title"
            placeholder="Tên chương mới..."
            required
            className="flex-1 rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          />
          <button className="btn-primary !py-2 text-xs">
            <Plus size={14} /> Thêm chương
          </button>
        </form>
      </div>
    </div>
  );
}
