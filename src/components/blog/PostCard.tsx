import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export type PostCardData = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
  category: { name: string; slug: string } | null;
};

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card-surface group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <FileText size={36} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {post.category ? (
          <span className="text-xs font-bold uppercase tracking-wide text-accent-600">{post.category.name}</span>
        ) : null}
        <h3 className="font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-accent-600">
          {post.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
        {post.publishedAt ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
            <CalendarDays size={14} /> {formatDate(post.publishedAt)}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
