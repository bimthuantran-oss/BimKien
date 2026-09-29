import Link from 'next/link';
import { Plus, Eye, Trash2, Pencil } from 'lucide-react';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { deletePost, saveCategory } from '@/lib/actions/posts';

export const metadata = { title: 'Bài viết · Admin' };

export default async function AdminPostsPage() {
  const [posts, categories] = await Promise.all([
    db.post.findMany({ orderBy: { createdAt: 'desc' }, include: { category: true, author: true } }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-500">{posts.length} bài viết</p>
        <Link href="/admin/bai-viet/moi" className="btn-primary !py-2.5">
          <Plus size={16} /> Bài viết mới
        </Link>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3">Tiêu đề</th>
              <th className="px-5 py-3">Chuyên mục</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Lượt xem</th>
              <th className="px-5 py-3">Ngày tạo</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3 font-medium text-ink-900">{p.title}</td>
                <td className="px-5 py-3 text-ink-500">{p.category?.name ?? '—'}</td>
                <td className="px-5 py-3">
                  <Badge variant={p.status === 'PUBLISHED' ? 'accent' : 'outline'}>
                    {p.status === 'PUBLISHED' ? 'Xuất bản' : 'Nháp'}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-ink-500">
                  <span className="flex items-center gap-1">
                    <Eye size={13} /> {p.viewCount}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink-500">{formatDate(p.createdAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/bai-viet/${p.id}`} className="rounded-md p-2 text-ink-500 hover:bg-ink-50 hover:text-accent-600">
                      <Pencil size={15} />
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="rounded-md p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-400">
                  Chưa có bài viết nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="card-surface p-6">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ink-500">Chuyên mục</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge key={c.id} variant="outline">
              {c.name}
              {c.nameEn ? <span className="ml-1 text-ink-400">({c.nameEn})</span> : null}
            </Badge>
          ))}
        </div>
        <form action={saveCategory} className="flex max-w-xl flex-wrap gap-2">
          <input
            name="name"
            placeholder="Tên chuyên mục mới"
            required
            className="min-w-0 flex-1 rounded-lg border border-ink-200 p-2.5 text-sm focus:border-accent-500 focus:outline-none"
          />
          <input
            name="nameEn"
            placeholder="Tên tiếng Anh (tuỳ chọn)"
            className="min-w-0 flex-1 rounded-lg border border-ink-200 p-2.5 text-sm focus:border-accent-500 focus:outline-none"
          />
          <button className="btn-outline-dark !px-4 !py-2.5 text-xs">Thêm</button>
        </form>
      </div>
    </div>
  );
}
