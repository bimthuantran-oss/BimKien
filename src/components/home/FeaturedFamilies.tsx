import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { FamilyCard } from '@/components/family/FamilyCard';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import type { Locale } from '@/lib/i18n/locale';

export async function FeaturedFamilies({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const families = await db.family.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { downloadCount: 'desc' },
    take: 5,
    include: { category: true },
  });

  if (families.length === 0) return null;

  return (
    <section className="bg-ink-50 py-20 md:py-28">
      <div className="container-wide">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t.home.familyEyebrow}
            title={t.home.familyTitle}
            accent={t.home.familyAccent}
            description={t.home.familyDescription}
          />
          <Link href="/family" className="btn-outline-dark shrink-0">
            {t.home.familyButton} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {families.map((f, i) => (
            <Reveal key={f.id} delay={i * 60}>
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
      </div>
    </section>
  );
}
