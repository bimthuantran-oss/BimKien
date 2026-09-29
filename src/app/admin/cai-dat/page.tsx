import { requireAdmin } from '@/lib/admin-auth';
import { getSiteSettings } from '@/lib/settings';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const metadata = { title: 'Cài đặt · Admin' };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink-900">Cài đặt chung</h2>
      <SettingsForm settings={settings} />
    </div>
  );
}
