import Link from 'next/link';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { PROJECT_TYPES } from '@/lib/constants';
import { deleteProject } from '@/lib/actions/projects';

export const metadata = { title: 'Dự án · Admin' };

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-500">{projects.length} dự án</p>
        <Link href="/admin/du-an/moi" className="btn-primary !py-2.5">
          <Plus size={16} /> Dự án mới
        </Link>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3">Tên dự án</th>
              <th className="px-5 py-3">Loại</th>
              <th className="px-5 py-3">Địa điểm</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Ngày tạo</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3 font-medium text-ink-900">{p.title}</td>
                <td className="px-5 py-3 text-ink-500">{PROJECT_TYPES[p.projectType] ?? p.projectType}</td>
                <td className="px-5 py-3 text-ink-500">{p.location ?? '—'}</td>
                <td className="px-5 py-3">
                  <Badge variant={p.status === 'PUBLISHED' ? 'accent' : 'outline'}>
                    {p.status === 'PUBLISHED' ? 'Xuất bản' : 'Nháp'}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-ink-500">{formatDate(p.createdAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/du-an/${p.id}`} className="rounded-md p-2 text-ink-500 hover:bg-ink-50 hover:text-accent-600">
                      <Pencil size={15} />
                    </Link>
                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="rounded-md p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-400">
                  Chưa có dự án nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
