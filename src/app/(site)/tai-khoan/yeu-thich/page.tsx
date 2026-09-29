import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostCard } from '@/components/blog/PostCard';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Bài viết yêu thích' };

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect('/dang-nhap?next=/tai-khoan/yeu-thich');

  const locale = getServerLocale();
  const t = getDictionary(locale);

  const favorites = await db.favoritePost.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { post: { include: { category: true } } },
  });

  return (
    <div className="container-wide py-16">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink-900">{t.account.favoritesTitle}</h1>
      <p className="mb-10 text-ink-500">{t.account.favoritesDescription}</p>

      {favorites.length === 0 ? (
        <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-500">{t.account.noFavorites}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <PostCard
              key={f.id}
              post={{
                slug: f.post.slug,
                title: localized(f.post.title, f.post.titleEn, locale),
                excerpt: localized(f.post.excerpt, f.post.excerptEn, locale),
                coverImage: f.post.coverImage,
                publishedAt: f.post.publishedAt,
                category: f.post.category
                  ? { name: localized(f.post.category.name, f.post.category.nameEn, locale), slug: f.post.category.slug }
                  : null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
