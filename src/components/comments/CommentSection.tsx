'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MessageCircle, Send, CornerDownRight } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useLocale } from '@/components/providers/LocaleProvider';

export type CommentData = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
  parentId: string | null;
};

export function CommentSection({
  postId,
  courseId,
  initialComments,
}: {
  postId?: string;
  courseId?: string;
  initialComments: CommentData[];
}) {
  const { data: session } = useSession();
  const { t } = useLocale();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roots = comments.filter((c) => !c.parentId);
  const repliesOf = (id: string) => comments.filter((c) => c.parentId === id);

  async function submit(parentId: string | null) {
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, postId, courseId, parentId: parentId ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Có lỗi xảy ra');
        return;
      }
      setComments((prev) => [
        ...prev,
        { ...data.comment, createdAt: data.comment.createdAt ?? new Date().toISOString() },
      ]);
      setContent('');
      setReplyTo(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h3 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-ink-900">
        <MessageCircle size={20} /> {t.blog.comments} ({comments.length})
      </h3>

      {session ? (
        <div className="mb-8">
          <textarea
            value={replyTo ? content : content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder={t.blog.writeComment}
            className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
          />
          {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => submit(null)}
              disabled={submitting}
              className="btn-primary !px-5 !py-2.5 text-xs disabled:opacity-50"
            >
              {t.blog.submitComment} <Send size={14} />
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-8 rounded-lg bg-ink-50 p-4 text-sm text-ink-600">
          <Link href="/dang-nhap" className="font-semibold text-accent-600 hover:underline">
            {t.nav.login}
          </Link>{' '}
          {t.blog.loginToComment}
        </p>
      )}

      <div className="space-y-6">
        {roots.length === 0 ? (
          <p className="text-sm text-ink-400">{t.blog.noComments}</p>
        ) : (
          roots.map((c) => (
            <div key={c.id}>
              <CommentItem comment={c} />
              {session ? (
                <button
                  onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  className="ml-11 mt-1 flex items-center gap-1 text-xs font-semibold text-ink-400 hover:text-accent-600"
                >
                  <CornerDownRight size={12} /> {t.blog.reply}
                </button>
              ) : null}
              {replyTo === c.id ? (
                <div className="ml-11 mt-3">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={2}
                    placeholder={`${t.blog.reply} ${c.author.name}...`}
                    className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button onClick={() => setReplyTo(null)} className="btn-ghost !px-4 !py-2 text-xs">
                      {t.common.cancel}
                    </button>
                    <button
                      onClick={() => submit(c.id)}
                      disabled={submitting}
                      className="btn-primary !px-4 !py-2 text-xs disabled:opacity-50"
                    >
                      {t.common.send}
                    </button>
                  </div>
                </div>
              ) : null}
              <div className="ml-11 mt-4 space-y-4 border-l-2 border-ink-100 pl-5">
                {repliesOf(c.id).map((r) => (
                  <CommentItem key={r.id} comment={r} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentData }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
        {comment.author.name?.[0]?.toUpperCase() ?? 'U'}
      </span>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink-900">{comment.author.name}</span>
          <span className="text-xs text-ink-400">{formatDateTime(comment.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">{comment.content}</p>
      </div>
    </div>
  );
}
