import { requireAdmin } from '@/lib/admin-auth';
import { getSiteSettings } from '@/lib/settings';
import { db } from '@/lib/db';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { StatsForm } from '@/components/admin/StatsForm';

export const metadata = { title: 'Cài đặt · Admin' };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  const statItems = await db.statItem.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Cài đặt chung</h2>
        <SettingsForm settings={settings} />
      </div>
      {statItems.length > 0 ? <StatsForm items={statItems} /> : null}
    </div>
  );
}
