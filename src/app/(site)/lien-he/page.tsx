import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/lib/settings';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getServerLocale } from '@/lib/i18n/get-server-locale';

export const metadata: Metadata = { title: 'Liên hệ' };

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const locale = getServerLocale();
  const t = getDictionary(locale);

  return (
    <div className="pb-24">
      <div className="border-b border-ink-100 bg-ink-950 py-16">
        <div className="container-wide">
          <p className="eyebrow mb-3">{t.contact.pageEyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            {t.contact.pageTitle} <span className="text-accent-500">{t.contact.pageAccent}</span>
          </h1>
          <p className="mt-4 max-w-xl text-ink-300">{t.contact.pageDescription}</p>
        </div>
      </div>

      <div className="container-wide mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
        <aside className="h-fit space-y-5 rounded-xl border border-ink-100 bg-ink-50 p-6">
          <h3 className="font-display text-lg font-bold text-ink-900">{t.contact.contactInfo}</h3>
          {settings.address ? (
            <p className="flex items-start gap-3 text-sm text-ink-600">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent-500" /> {settings.address}
            </p>
          ) : null}
          {settings.phone ? (
            <p className="flex items-center gap-3 text-sm text-ink-600">
              <Phone size={18} className="shrink-0 text-accent-500" /> {settings.phone}
            </p>
          ) : null}
          {settings.email ? (
            <p className="flex items-center gap-3 text-sm text-ink-600">
              <Mail size={18} className="shrink-0 text-accent-500" /> {settings.email}
            </p>
          ) : null}
          <p className="flex items-center gap-3 text-sm text-ink-600">
            <Clock size={18} className="shrink-0 text-accent-500" /> {t.footer.workingHours}
          </p>
        </aside>
      </div>
    </div>
  );
}
