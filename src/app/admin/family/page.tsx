import Link from 'next/link';
import { Plus, Trash2, Pencil, Download } from 'lucide-react';
import { db } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { deleteFamily, saveFamilyCategory, deleteFamilyCategory } from '@/lib/actions/families';

export const metadata = { title: 'Family Revit · Admin' };

export default async function AdminFamilyPage() {
  const [families, categories] = await Promise.all([
    db.family.findMany({ orderBy: { createdAt: 'desc' }, include: { category: true } }),
    db.familyCategory.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { families: true } } } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink-500">{families.length} family</p>
        <Link href="/admin/family/moi" className="btn-primary !py-2.5">
          <Plus size={16} /> Family mới
        </Link>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3">Tên family</th>
              <th className="px-5 py-3">Danh mục</th>
              <th className="px-5 py-3">Giá</th>
              <th className="px-5 py-3">Lượt tải</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {families.map((f) => (
              <tr key={f.id}>
                <td className="px-5 py-3 font-medium text-ink-900">{f.title}</td>
                <td className="px-5 py-3 text-ink-500">{f.category?.name ?? '—'}</td>
                <td className="px-5 py-3 text-ink-500">{f.price === 0 ? 'Miễn phí' : `${f.price.toLocaleString('vi-VN')}đ`}</td>
                <td className="px-5 py-3 text-ink-500">
                  <span className="flex items-center gap-1">
                    <Download size={13} /> {f.downloadCount}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Badge variant={f.status === 'PUBLISHED' ? 'accent' : 'outline'}>
                    {f.status === 'PUBLISHED' ? 'Xuất bản' : 'Nháp'}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/family/${f.id}`} className="rounded-md p-2 text-ink-500 hover:bg-ink-50 hover:text-accent-600">
                      <Pencil size={15} />
                    </Link>
                    <form action={deleteFamily}>
                      <input type="hidden" name="id" value={f.id} />
                      <button className="rounded-md p-2 text-ink-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {families.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-400">
                  Chưa có family nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="card-surface p-6">
        <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ink-500">Danh mục family</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-2 rounded-full border border-ink-200 py-1 pl-3 pr-1 text-xs">
              {c.name}
              {c.nameEn ? <span className="text-ink-400">({c.nameEn})</span> : null} · {c._count.families}
              <form action={deleteFamilyCategory}>
                <input type="hidden" name="id" value={c.id} />
                <button className="flex h-5 w-5 items-center justify-center rounded-full text-ink-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={11} />
                </button>
              </form>
            </span>
          ))}
        </div>
        <form action={saveFamilyCategory} className="flex max-w-xl flex-wrap gap-2">
          <input
            name="name"
            placeholder="Tên danh mục mới (VD: Cửa, Nội thất...)"
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
