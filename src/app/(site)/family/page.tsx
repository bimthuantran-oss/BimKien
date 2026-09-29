import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { FamilyCard } from '@/components/family/FamilyCard';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Thư viện Family Revit' };

export default async function FamilyLibraryPage({
  searchParams,
}: {
  searchParams: { category?: string; type?: string };
}) {
  const locale = getServerLocale();
  const t = getDictionary(locale);
  const category = searchParams.category;
  const type = searchParams.type; // 'free' | 'paid'

  const [families, categories] = await Promise.all([
    db.family.findMany({
      where: {
        status: 'PUBLISHED',
        ...(category ? { category: { slug: category } } : {}),
        ...(type === 'free' ? { price: 0 } : {}),
        ...(type === 'paid' ? { price: { gt: 0 } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    db.familyCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="pb-24">
      <div className="border-b border-ink-100 bg-ink-950 py-16">
        <div className="container-wide">
          <p className="eyebrow mb-3">{t.family.pageEyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            {t.family.pageTitle} <span className="text-accent-500">{t.family.pageAccent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-ink-300">{t.family.pageDescription}</p>
        </div>
      </div>

      <div className="container-wide mt-10">
        <div className="mb-6 flex flex-wrap gap-2">
          <FilterLink href="/family" active={!type} label={t.common.all} />
          <FilterLink href="/family?type=free" active={type === 'free'} label={t.common.free} />
          <FilterLink href="/family?type=paid" active={type === 'paid'} label={t.common.paid} />
        </div>

        {categories.length > 0 ? (
          <div className="mb-10 flex flex-wrap gap-2 border-t border-ink-100 pt-6">
            <FilterLink href="/family" active={!category} label={t.family.allCategories} muted />
            {categories.map((c) => (
              <FilterLink
                key={c.id}
                href={`/family?category=${c.slug}`}
                active={category === c.slug}
                label={localized(c.name, c.nameEn, locale)}
                muted
              />
            ))}
          </div>
        ) : null}

        {families.length === 0 ? (
          <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-500">{t.family.noResults}</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {families.map((f, i) => (
              <Reveal key={f.id} delay={(i % 5) * 60}>
                <FamilyCard
                  locale={locale}
                  family={{
                    slug: f.slug,
                    title: localized(f.title, f.titleEn, locale),
                    previewImage: f.previewImage,
                    price: f.price,
                    downloadCount: f.downloadCount,
                    category: f.category ? { name: localized(f.category.name, f.category.nameEn, locale) } : null,
                  }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterLink({ href, active, label, muted }: { href: string; active: boolean; label: string; muted?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide',
        active
          ? 'border-accent-500 bg-accent-500 text-white'
          : muted
            ? 'border-ink-200 text-ink-500 hover:border-ink-400'
            : 'border-ink-900/20 text-ink-700 hover:border-ink-900'
      )}
    >
      {label}
    </Link>
  );
}
