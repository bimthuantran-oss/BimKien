import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Download, Clock } from 'lucide-react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { FamilyCard } from '@/components/family/FamilyCard';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Family đã tải/mua' };

export default async function MyFamiliesPage() {
  const session = await auth();
  if (!session?.user) redirect('/dang-nhap?next=/tai-khoan/family');

  const locale = getServerLocale();
  const t = getDictionary(locale);
  const STATUS_LABEL: Record<string, string> = {
    PENDING: t.account.statusPending,
    APPROVED: t.account.statusApproved,
    REJECTED: t.account.statusRejected,
  };

  const [accessList, pendingRequests] = await Promise.all([
    db.familyAccess.findMany({
      where: { userId: session.user.id },
      orderBy: { grantedAt: 'desc' },
      include: { family: { include: { category: true } } },
    }),
    db.familyPurchaseRequest.findMany({
      where: { userId: session.user.id, status: { in: ['PENDING', 'REJECTED'] } },
      orderBy: { createdAt: 'desc' },
      include: { family: true },
    }),
  ]);

  return (
    <div className="container-wide py-16">
      <h1 className="mb-2 font-display text-3xl font-bold text-ink-900">{t.account.myFamiliesTitle}</h1>
      <p className="mb-10 text-ink-500">{t.account.myFamiliesDescription}</p>

      {pendingRequests.length > 0 ? (
        <div className="mb-10 space-y-3">
          <h2 className="font-display text-lg font-bold text-ink-900">{t.account.purchaseRequests}</h2>
          {pendingRequests.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-4">
              <div>
                <p className="text-sm font-semibold text-ink-900">{localized(r.family.title, r.family.titleEn, locale)}</p>
                <p className="flex items-center gap-1.5 text-xs text-ink-400">
                  <Clock size={12} /> {t.account.submittedOn} {formatDate(r.createdAt)}
                </p>
              </div>
              <Badge variant={r.status === 'PENDING' ? 'outline' : 'ink'}>{STATUS_LABEL[r.status]}</Badge>
            </div>
          ))}
        </div>
      ) : null}

      <h2 className="mb-4 font-display text-lg font-bold text-ink-900">{t.account.availableToDownload}</h2>
      {accessList.length === 0 ? (
        <p className="rounded-xl border border-ink-100 bg-ink-50 p-10 text-center text-ink-500">
          {t.account.noFamilyAccess} {t.account.freeFamiliesHint}{' '}
          <a href="/family" className="font-semibold text-accent-600 hover:underline">
            {t.account.familyLibrary}
          </a>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {accessList.map((a) => (
            <div key={a.id} className="relative">
              <FamilyCard
                locale={locale}
                family={{
                  slug: a.family.slug,
                  title: localized(a.family.title, a.family.titleEn, locale),
                  previewImage: a.family.previewImage,
                  price: a.family.price,
                  downloadCount: a.family.downloadCount,
                  category: a.family.category
                    ? { name: localized(a.family.category.name, a.family.category.nameEn, locale) }
                    : null,
                }}
              />
              <a
                href={`/api/family/${a.family.id}/download`}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white shadow-card"
                title={t.common.download}
              >
                <Download size={14} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
