import Link from 'next/link';
import { FileText, Building2, GraduationCap, Users, Eye, Mail } from 'lucide-react';
import { db } from '@/lib/db';
import { ViewsLineChart, TopBarChart } from '@/components/admin/DashboardCharts';

export const metadata = { title: 'Tổng quan · Admin' };

function formatDayLabel(d: Date) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(d);
}

export default async function AdminDashboardPage() {
  const [postCount, projectCount, courseCount, studentCount, newContactCount, viewAgg, viewEvents, topPosts, enrollmentGroups] =
    await Promise.all([
      db.post.count(),
      db.project.count(),
      db.course.count(),
      db.user.count({ where: { role: 'STUDENT' } }),
      db.contact.count({ where: { status: 'NEW' } }),
      db.post.aggregate({ _sum: { viewCount: true } }),
      db.viewEvent.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) } },
        select: { createdAt: true },
      }),
      db.post.findMany({ orderBy: { viewCount: 'desc' }, take: 5, select: { title: true, viewCount: true } }),
      db.enrollment.groupBy({ by: ['courseId'], _count: { courseId: true } }),
    ]);

  const days: { date: string; views: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push({ date: formatDayLabel(d), views: 0 });
  }
  for (const ev of viewEvents) {
    const label = formatDayLabel(ev.createdAt);
    const bucket = days.find((d) => d.date === label);
    if (bucket) bucket.views += 1;
  }

  const topCourseIds = enrollmentGroups
    .sort((a, b) => b._count.courseId - a._count.courseId)
    .slice(0, 5)
    .map((g) => g.courseId);
  const courses = await db.course.findMany({ where: { id: { in: topCourseIds } }, select: { id: true, title: true } });
  const topCourses = enrollmentGroups
    .sort((a, b) => b._count.courseId - a._count.courseId)
    .slice(0, 5)
    .map((g) => ({
      name: courses.find((c) => c.id === g.courseId)?.title ?? '—',
      value: g._count.courseId,
    }));

  const cards = [
    { label: 'Tổng bài viết', value: postCount, icon: FileText, href: '/admin/bai-viet' },
    { label: 'Tổng dự án', value: projectCount, icon: Building2, href: '/admin/du-an' },
    { label: 'Tổng khóa học', value: courseCount, icon: GraduationCap, href: '/admin/khoa-hoc' },
    { label: 'Tổng học viên', value: studentCount, icon: Users, href: '/admin/nguoi-dung' },
    { label: 'Tổng lượt xem', value: viewAgg._sum.viewCount ?? 0, icon: Eye, href: '/admin/bai-viet' },
    { label: 'Liên hệ mới', value: newContactCount, icon: Mail, href: '/admin/lien-he' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card-surface flex flex-col gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
              <c.icon size={18} />
            </span>
            <span className="font-display text-2xl font-extrabold text-ink-900">{c.value.toLocaleString('vi-VN')}</span>
            <span className="text-xs font-medium text-ink-500">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card-surface p-6">
          <h3 className="mb-4 font-display text-base font-bold text-ink-900">Lượt xem bài viết (14 ngày gần nhất)</h3>
          <ViewsLineChart data={days} />
        </div>
        <div className="card-surface p-6">
          <h3 className="mb-4 font-display text-base font-bold text-ink-900">Bài viết được xem nhiều nhất</h3>
          <TopBarChart data={topPosts.map((p) => ({ name: p.title, value: p.viewCount }))} />
        </div>
      </div>

      <div className="card-surface p-6">
        <h3 className="mb-4 font-display text-base font-bold text-ink-900">Khóa học đăng ký nhiều nhất</h3>
        {topCourses.length > 0 ? (
          <TopBarChart data={topCourses} />
        ) : (
          <p className="text-sm text-ink-400">Chưa có dữ liệu đăng ký khóa học.</p>
        )}
      </div>
    </div>
  );
}
