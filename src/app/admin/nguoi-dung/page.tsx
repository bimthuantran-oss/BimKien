import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { updateUserRole, toggleUserBan } from '@/lib/actions/users';

export const metadata = { title: 'Người dùng · Admin' };

const ROLE_LABEL: Record<string, string> = { ADMIN: 'Quản trị viên', EDITOR: 'Biên tập viên', STUDENT: 'Học viên' };

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { enrollments: true, comments: true, lessonProgress: true } } },
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-500">{users.length} người dùng</p>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-5 py-3">Người dùng</th>
              <th className="px-5 py-3">Vai trò</th>
              <th className="px-5 py-3">Lịch sử học tập</th>
              <th className="px-5 py-3">Ngày tham gia</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3">
                  <p className="font-medium text-ink-900">{u.name}</p>
                  <p className="text-xs text-ink-400">{u.email}</p>
                  <p className="text-xs text-ink-400">{u.phone || '—'}</p>
                </td>
                <td className="px-5 py-3">
                  <form action={updateUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded-md border border-ink-200 px-2 py-1.5 text-xs focus:border-accent-500 focus:outline-none"
                    >
                      {Object.entries(ROLE_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button className="text-xs font-semibold text-accent-600 hover:underline">Lưu</button>
                  </form>
                </td>
                <td className="px-5 py-3 text-xs text-ink-500">
                  {u._count.enrollments} khóa học · {u._count.lessonProgress} bài đã học · {u._count.comments} bình luận
                </td>
                <td className="px-5 py-3 text-ink-500">{formatDate(u.createdAt)}</td>
                <td className="px-5 py-3">
                  <Badge variant={u.isBanned ? 'outline' : 'accent'}>{u.isBanned ? 'Đã khóa' : 'Hoạt động'}</Badge>
                </td>
                <td className="px-5 py-3">
                  <form action={toggleUserBan}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="isBanned" value={String(u.isBanned)} />
                    <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:border-red-300 hover:text-red-600">
                      {u.isBanned ? 'Mở khóa' : 'Khóa tài khoản'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
