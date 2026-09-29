import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CalendarDays, User, Eye } from 'lucide-react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { FavoriteButton } from '@/components/blog/FavoriteButton';
import { CommentSection } from '@/components/comments/CommentSection';
import { PostCard } from '@/components/blog/PostCard';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

async function getPost(slug: string) {
  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: true,
      tags: true,
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
    },
  });
  return post;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  const locale = getServerLocale();
  return {
    title: localized(post.metaTitle || post.title, post.metaTitleEn, locale),
    description: localized(post.metaDescription || post.excerpt, post.metaDescriptionEn, locale),
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post || post.status !== 'PUBLISHED') notFound();

  const locale = getServerLocale();
  const t = getDictionary(locale);
  const session = await auth();

  db.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
  db.viewEvent.create({ data: { postId: post.id } }).catch(() => {});

  const [favorite, related] = await Promise.all([
    session?.user
      ? db.favoritePost.findUnique({ where: { userId_postId: { userId: session.user.id, postId: post.id } } })
      : null,
    db.post.findMany({
      where: { status: 'PUBLISHED', id: { not: post.id }, categoryId: post.categoryId ?? undefined },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: { category: true },
    }),
  ]);

  const title = localized(post.title, post.titleEn, locale);
  const content = localized(post.content, post.contentEn, locale);
  const categoryName = post.category ? localized(post.category.name, post.category.nameEn, locale) : null;

  return (
    <article className="pb-24">
      <div className="border-b border-ink-100 bg-ink-950 py-16">
        <div className="container-wide max-w-3xl">
          {post.category ? (
            <Link href={`/blog?category=${post.category.slug}`}>
              <Badge>{categoryName}</Badge>
            </Link>
          ) : null}
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-white md:text-4xl">{title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-ink-300">
            <span className="flex items-center gap-1.5">
              <User size={15} /> {post.author.name}
            </span>
            {post.publishedAt ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} /> {formatDate(post.publishedAt)}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Eye size={15} /> {post.viewCount.toLocaleString('vi-VN')} {t.common.views}
            </span>
          </div>
        </div>
      </div>

      {post.coverImage ? (
        <div className="container-wide -mt-10 max-w-4xl">
          <div className="relative aspect-[16/8] overflow-hidden rounded-xl shadow-card">
            <Image src={post.coverImage} alt={title} fill className="object-cover" />
          </div>
        </div>
      ) : null}

      <div className="container-wide mt-12 max-w-3xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                #{tag.name}
              </Badge>
            ))}
          </div>
          <FavoriteButton postId={post.id} initialFavorited={Boolean(favorite)} />
        </div>

        <div className="prose-bim" dangerouslySetInnerHTML={{ __html: content }} />

        <hr className="my-12 border-ink-100" />

        <CommentSection
          postId={post.id}
          initialComments={post.comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))}
        />
      </div>

      {related.length > 0 ? (
        <div className="container-wide mt-20 max-w-5xl border-t border-ink-100 pt-12">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink-900">{t.blog.relatedPosts}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <PostCard
                key={p.id}
                post={{
                  slug: p.slug,
                  title: localized(p.title, p.titleEn, locale),
                  excerpt: localized(p.excerpt, p.excerptEn, locale),
                  coverImage: p.coverImage,
                  publishedAt: p.publishedAt,
                  category: p.category
                    ? { name: localized(p.category.name, p.category.nameEn, locale), slug: p.category.slug }
                    : null,
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
