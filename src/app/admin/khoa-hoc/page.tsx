import Link from 'next/link';
import { Plus, Trash2, Pencil, Layers, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { COURSE_LEVEL_LABEL } from '@/lib/constants';
import { deleteCourse } from '@/lib/actions/courses';

export const metadata = { title: 'Khóa học · Admin' };

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      chapters: { include: { _count: { select: { lessons: true } } } },
      _count: { select: { enrollments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-500">{courses.length} khóa học</p>
        <Link href="/admin/khoa-hoc/moi" className="btn-primary !py-2.5">
          <Plus size={16} /> Khóa học mới
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="card-surface flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-bold text-ink-900">{c.title}</h3>
              <Badge variant={c.status === 'PUBLISHED' ? 'accent' : 'outline'}>
                {c.status === 'PUBLISHED' ? 'Xuất bản' : 'Nháp'}
              </Badge>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
              {COURSE_LEVEL_LABEL[c.level] ?? c.level}
            </p>
            <div className="flex items-center gap-4 text-xs text-ink-500">
              <span className="flex items-center gap-1">
                <Layers size={13} /> {c.chapters.reduce((s, ch) => s + ch._count.lessons, 0)} bài học
              </span>
              <span className="flex items-center gap-1">
                <Users size={13} /> {c._count.enrollments} học viên
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Link href={`/admin/khoa-hoc/${c.id}`} className="btn-outline-dark flex-1 !py-2 text-xs">
                <Pencil size={14} /> Quản lý
              </Link>
              <form action={deleteCourse}>
                <input type="hidden" name="id" value={c.id} />
                <button className="rounded-md p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </form>
            </div>
          </div>
        ))}
        {courses.length === 0 ? (
          <p className="col-span-full rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-400">
            Chưa có khóa học nào.
          </p>
        ) : null}
      </div>
    </div>
  );
}
