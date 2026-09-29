import Link from 'next/link';
import { db } from '@/lib/db';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { updateCommentStatus, deleteComment } from '@/lib/actions/comments';

export const metadata = { title: 'Bình luận · Admin' };

const STATUS_LABEL: Record<string, string> = { PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', HIDDEN: 'Đã ẩn' };

export default async function AdminCommentsPage() {
  const comments = await db.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      post: { select: { title: true, slug: true } },
      course: { select: { title: true, slug: true } },
    },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-500">{comments.length} bình luận gần nhất</p>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
                <span className="font-semibold text-ink-900">{c.author.name}</span>
                <span>·</span>
                <span>{formatDateTime(c.createdAt)}</span>
                <span>·</span>
                {c.post ? (
                  <Link href={`/blog/${c.post.slug}`} target="_blank" className="text-accent-600 hover:underline">
                    {c.post.title}
                  </Link>
                ) : c.course ? (
                  <Link href={`/khoa-hoc/${c.course.slug}`} target="_blank" className="text-accent-600 hover:underline">
                    {c.course.title}
                  </Link>
                ) : null}
                <Badge variant={c.status === 'APPROVED' ? 'accent' : c.status === 'PENDING' ? 'outline' : 'ink'}>
                  {STATUS_LABEL[c.status]}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-ink-700">{c.content}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              {c.status !== 'APPROVED' ? (
                <form action={updateCommentStatus}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold hover:border-accent-500 hover:text-accent-600">
                    Duyệt
                  </button>
                </form>
              ) : null}
              {c.status !== 'HIDDEN' ? (
                <form action={updateCommentStatus}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="status" value="HIDDEN" />
                  <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold hover:border-ink-400">
                    Ẩn
                  </button>
                </form>
              ) : null}
              <form action={deleteComment}>
                <input type="hidden" name="id" value={c.id} />
                <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-300">
                  Xóa
                </button>
              </form>
            </div>
          </div>
        ))}
        {comments.length === 0 ? (
          <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-400">Chưa có bình luận nào.</p>
        ) : null}
      </div>
    </div>
  );
}
