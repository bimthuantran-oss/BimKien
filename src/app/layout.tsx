import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { getSiteSettings } from '@/lib/settings';
import { getServerLocale } from '@/lib/i18n/get-server-locale';
import { localized } from '@/lib/i18n/localized';

const sans = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' });
const display = Sora({ subsets: ['latin', 'latin-ext'], variable: '--font-display', weight: ['600', '700', '800'] });

// Co-locate serverless functions with the Neon database (ap-southeast-1 /
// Singapore) instead of Vercel's default US region, to avoid a cross-Pacific
// round trip on every request.
export const preferredRegion = 'sin1';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = getServerLocale();
  const title = localized(settings.defaultMetaTitle || settings.siteName, settings.defaultMetaTitleEn, locale);
  const description = localized(settings.defaultMetaDescription || settings.tagline || '', settings.defaultMetaDescriptionEn, locale);
  return {
    title: {
      default: title,
      template: `%s · ${settings.siteName}`,
    },
    description: description || undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getServerLocale();
  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <LocaleProvider initialLocale={locale}>
          <SessionProvider>{children}</SessionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
