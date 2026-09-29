import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { PostCard } from '@/components/blog/PostCard';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import type { Locale } from '@/lib/i18n/locale';

export async function FeaturedPosts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const posts = await db.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: { category: true },
  });

  if (posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t.home.postsEyebrow}
            title={t.home.postsTitle}
            accent={t.home.postsAccent}
            description={t.home.postsDescription}
          />
          <Link href="/blog" className="btn-outline-dark shrink-0">
            {t.common.viewAll} {t.nav.blog.toLowerCase()} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
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
      </div>
    </section>
  );
}
