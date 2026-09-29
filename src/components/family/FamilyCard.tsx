import Link from 'next/link';
import Image from 'next/image';
import { Boxes, Download } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { getDictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/locale';

export type FamilyCardData = {
  slug: string;
  title: string;
  previewImage: string | null;
  price: number;
  downloadCount: number;
  category: { name: string } | null;
};

export function FamilyCard({ family, locale }: { family: FamilyCardData; locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <Link href={`/family/${family.slug}`} className="card-surface group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-ink-50">
        {family.previewImage ? (
          <Image
            src={family.previewImage}
            alt={family.title}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <Boxes size={40} />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge variant={family.price === 0 ? 'accent' : 'ink'}>
            {family.price === 0 ? t.common.free : `${family.price.toLocaleString('vi-VN')}đ`}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {family.category ? (
          <span className="text-xs font-bold uppercase tracking-wide text-accent-600">{family.category.name}</span>
        ) : null}
        <h3 className="line-clamp-2 flex-1 font-display text-sm font-bold leading-snug text-ink-900 group-hover:text-accent-600">
          {family.title}
        </h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
          <Download size={13} /> {family.downloadCount.toLocaleString('vi-VN')} {t.common.downloads}
        </div>
      </div>
    </Link>
  );
}
