import Link from 'next/link';
import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { db } from '@/lib/db';
import { PostCard } from '@/components/blog/PostCard';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Blog kiến thức BIM' };

const PAGE_SIZE = 9;

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; page?: string };
}) {
  const locale = getServerLocale();
  const t = getDictionary(locale);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const category = searchParams.category;
  const q = searchParams.q?.trim();

  const where = {
    status: 'PUBLISHED' as const,
    ...(category ? { category: { slug: category } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { excerpt: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [posts, total, categories] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    db.post.count({ where }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="bg-ink-950 pb-24">
      <div className="border-b border-white/5 py-16">
        <div className="container-wide">
          <p className="eyebrow mb-3">{t.blog.pageEyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            {t.blog.pageTitle} <span className="text-accent-500">{t.blog.pageAccent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-ink-300">{t.blog.pageDescription}</p>

          <form action="/blog" className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5">
            <Search size={18} className="text-ink-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={t.blog.searchPlaceholder}
              className="w-full bg-transparent text-sm text-white placeholder:text-ink-400 focus:outline-none"
            />
          </form>
        </div>
      </div>

      <div className="container-wide mt-10">
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={cn(
              'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide',
              !category ? 'border-accent-500 bg-accent-500 text-white' : 'border-white/15 text-ink-300 hover:border-white/40'
            )}
          >
            {t.common.all}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/blog?category=${c.slug}`}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide',
                category === c.slug
                  ? 'border-accent-500 bg-accent-500 text-white'
                  : 'border-white/15 text-ink-300 hover:border-white/40'
              )}
            >
              {localized(c.name, c.nameEn, locale)}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-ink-300">{t.blog.noResults}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <PostCard
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
              </Reveal>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(p) }).toString()}`}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
                  p === page ? 'bg-accent-500 text-white' : 'border border-white/15 text-ink-300 hover:border-white/40'
                )}
              >
                {p}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
