import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings } from '@/lib/settings';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const locale = getServerLocale();
  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} locale={locale} />
    </div>
  );
}
