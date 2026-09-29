import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Download, Lock, Clock, HardDrive, Boxes, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Badge } from '@/components/ui/Badge';
import { getSiteSettings } from '@/lib/settings';
import { requestFamilyPurchase } from '@/lib/actions/families';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized, localizedOptional } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

async function getFamily(slug: string) {
  return db.family.findUnique({ where: { slug }, include: { category: true } });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const family = await getFamily(params.slug);
  if (!family) return {};
  const locale = getServerLocale();
  return {
    title: localized(family.metaTitle || family.title, family.metaTitleEn, locale),
    description: localized(family.metaDescription || family.description, family.metaDescriptionEn, locale),
  };
}

export default async function FamilyDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { requested?: string };
}) {
  const family = await getFamily(params.slug);
  if (!family || family.status !== 'PUBLISHED') notFound();

  const locale = getServerLocale();
  const t = getDictionary(locale);
  const session = await auth();
  const settings = await getSiteSettings();

  let hasAccess = family.price === 0;
  let pendingRequest = false;

  if (session?.user && family.price > 0) {
    const access = await db.familyAccess.findUnique({
      where: { userId_familyId: { userId: session.user.id, familyId: family.id } },
    });
    hasAccess = Boolean(access);
    if (!hasAccess) {
      const pending = await db.familyPurchaseRequest.findFirst({
        where: { userId: session.user.id, familyId: family.id, status: 'PENDING' },
      });
      pendingRequest = Boolean(pending);
    }
  }

  const title = localized(family.title, family.titleEn, locale);
  const description = localized(family.description, family.descriptionEn, locale);
  const categoryName = family.category ? localized(family.category.name, family.category.nameEn, locale) : null;
  const paymentInstructions = localizedOptional(settings.paymentInstructions, settings.paymentInstructionsEn, locale);

  return (
    <article className="pb-24">
      <div className="container-wide grid grid-cols-1 gap-10 py-14 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
            {family.previewImage ? (
              <Image src={family.previewImage} alt={title} fill className="object-contain p-6" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-300">
                <Boxes size={64} />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {family.category ? <Badge variant="outline">{categoryName}</Badge> : null}
          <h1 className="mt-4 font-display text-3xl font-extrabold text-ink-900 md:text-4xl">{title}</h1>
          <p className="mt-4 leading-relaxed text-ink-600">{description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-lg border border-ink-100 p-3">
              <p className="flex items-center gap-1.5 text-xs text-ink-400">
                <HardDrive size={13} /> {t.family.fileSize}
              </p>
              <p className="mt-1 font-semibold text-ink-900">{formatBytes(family.fileSize)}</p>
            </div>
            <div className="rounded-lg border border-ink-100 p-3">
              <p className="flex items-center gap-1.5 text-xs text-ink-400">
                <Clock size={13} /> {t.family.software}
              </p>
              <p className="mt-1 font-semibold text-ink-900">{family.softwareInfo || 'Revit'}</p>
            </div>
            <div className="rounded-lg border border-ink-100 p-3">
              <p className="flex items-center gap-1.5 text-xs text-ink-400">
                <Download size={13} /> {t.family.downloadCount}
              </p>
              <p className="mt-1 font-semibold text-ink-900">{family.downloadCount.toLocaleString('vi-VN')}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-ink-100 bg-ink-50 p-6">
            <p className="mb-4 font-display text-2xl font-extrabold text-ink-900">
              {family.price === 0 ? t.common.free : `${family.price.toLocaleString('vi-VN')}đ`}
            </p>

            {!family.fileUrl ? (
              <p className="text-sm text-ink-500">{t.family.fileNotReady}</p>
            ) : !session?.user ? (
              <Link href={`/dang-nhap?next=/family/${family.slug}`} className="btn-primary w-full sm:w-auto">
                <Lock size={16} /> {t.family.loginToDownload}
              </Link>
            ) : hasAccess ? (
              <a href={`/api/family/${family.id}/download`} className="btn-primary w-full sm:w-auto">
                <Download size={16} /> {t.common.download}
              </a>
            ) : pendingRequest || searchParams.requested === '1' ? (
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent-600">
                  <CheckCircle2 size={16} /> {t.family.requestSent}
                </p>
                {paymentInstructions ? (
                  <p className="whitespace-pre-line rounded-lg bg-white p-4 text-sm text-ink-600">{paymentInstructions}</p>
                ) : (
                  <p className="text-sm text-ink-500">{t.family.paymentFallback}</p>
                )}
              </div>
            ) : (
              <form action={requestFamilyPurchase}>
                <input type="hidden" name="familyId" value={family.id} />
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {t.common.buyNow}
                </button>
                <p className="mt-3 text-xs text-ink-400">{t.family.buyNoteHint}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
