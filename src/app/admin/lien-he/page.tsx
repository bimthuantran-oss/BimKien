import { db } from '@/lib/db';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { replyContact, updateContactStatus } from '@/lib/actions/contacts';

export const metadata = { title: 'Liên hệ · Admin' };

const STATUS_LABEL: Record<string, string> = { NEW: 'Mới', REPLIED: 'Đã trả lời', ARCHIVED: 'Lưu trữ' };

export default async function AdminContactsPage() {
  const contacts = await db.contact.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-500">{contacts.length} liên hệ</p>

      <div className="space-y-4">
        {contacts.map((c) => (
          <div key={c.id} className="card-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-bold text-ink-900">{c.subject}</p>
                <p className="text-xs text-ink-400">
                  {c.name} · {c.email} {c.phone ? `· ${c.phone}` : ''} · {formatDateTime(c.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={c.status === 'NEW' ? 'accent' : c.status === 'REPLIED' ? 'ink' : 'outline'}>
                  {STATUS_LABEL[c.status]}
                </Badge>
                {c.status !== 'ARCHIVED' ? (
                  <form action={updateContactStatus}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="status" value="ARCHIVED" />
                    <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold hover:border-ink-400">
                      Lưu trữ
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-ink-600">{c.message}</p>

            {c.adminReply ? (
              <div className="mt-4 rounded-lg bg-accent-50 p-4 text-sm text-ink-700">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-accent-600">Đã phản hồi</p>
                {c.adminReply}
              </div>
            ) : (
              <form action={replyContact} className="mt-4 space-y-2">
                <input type="hidden" name="id" value={c.id} />
                <textarea
                  name="adminReply"
                  required
                  rows={3}
                  placeholder="Nhập nội dung phản hồi..."
                  className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
                />
                <button className="btn-primary !py-2 text-xs">Gửi phản hồi</button>
              </form>
            )}
          </div>
        ))}
        {contacts.length === 0 ? (
          <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-400">Chưa có liên hệ nào.</p>
        ) : null}
      </div>
    </div>
  );
}
