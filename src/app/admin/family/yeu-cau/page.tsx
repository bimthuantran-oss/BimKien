import { db } from '@/lib/db';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { approveFamilyPurchase, rejectFamilyPurchase } from '@/lib/actions/families';

export const metadata = { title: 'Yêu cầu mua Family · Admin' };

const STATUS_LABEL: Record<string, string> = { PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' };

export default async function AdminFamilyRequestsPage() {
  const requests = await db.familyPurchaseRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, family: true },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-500">{requests.length} yêu cầu mua family</p>

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-base font-bold text-ink-900">{r.family.title}</p>
              <p className="text-xs text-ink-400">
                {r.user.name} ({r.user.email}) · Giá {r.family.price.toLocaleString('vi-VN')}đ · {formatDateTime(r.createdAt)}
              </p>
              {r.note ? <p className="mt-1 text-sm text-ink-600">Ghi chú: {r.note}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant={r.status === 'PENDING' ? 'outline' : r.status === 'APPROVED' ? 'accent' : 'ink'}>
                {STATUS_LABEL[r.status]}
              </Badge>
              {r.status === 'PENDING' ? (
                <>
                  <form action={approveFamilyPurchase}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold hover:border-accent-500 hover:text-accent-600">
                      Duyệt (đã nhận tiền)
                    </button>
                  </form>
                  <form action={rejectFamilyPurchase}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-300">
                      Từ chối
                    </button>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        ))}
        {requests.length === 0 ? (
          <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-400">Chưa có yêu cầu mua nào.</p>
        ) : null}
      </div>
    </div>
  );
}
