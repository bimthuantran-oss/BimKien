import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { SiteSettings } from '@/lib/settings';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { localized } from '@/lib/i18n/localized';
import type { Locale } from '@/lib/i18n/locale';
import { LogoMark } from '@/components/ui/LogoMark';

export function Footer({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const t = getDictionary(locale);
  const tagline = localized(settings.tagline ?? '', settings.taglineEn, locale);

  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="border-b border-white/10">
        <div className="container-wide flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <div>
            <p className="eyebrow mb-1">{t.footer.tagline}</p>
            <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
              {t.footer.ctaTitlePrefix} <span className="text-accent-500">{t.footer.ctaTitleHighlight}</span>{' '}
              {t.footer.ctaTitleSuffix}
            </h3>
          </div>
          <Link href="/lien-he" className="btn-primary whitespace-nowrap">
            {t.footer.ctaButton}
          </Link>
        </div>
      </div>

      <div className="container-wide grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-white">
            {settings.logoUrl ? (
              <Image src={settings.logoUrl} alt={settings.siteName} width={32} height={32} className="rounded" />
            ) : (
              <LogoMark className="h-9 w-9" />
            )}
            {settings.siteName}
          </Link>
          <p className="mb-5 text-sm leading-relaxed text-ink-400">{tagline}</p>
          <div className="flex gap-3">
            {settings.facebookUrl ? <SocialIcon href={settings.facebookUrl} icon={<Facebook size={16} />} /> : null}
            {settings.youtubeUrl ? <SocialIcon href={settings.youtubeUrl} icon={<Youtube size={16} />} /> : null}
            {settings.linkedinUrl ? <SocialIcon href={settings.linkedinUrl} icon={<Linkedin size={16} />} /> : null}
          </div>
        </div>

        <FooterCol
          title={t.footer.quickLinks}
          links={[
            { href: '/', label: t.nav.home },
            { href: '/gioi-thieu', label: t.nav.about },
            { href: '/du-an', label: t.nav.projects },
            { href: '/khoa-hoc', label: t.nav.courses },
            { href: '/family', label: t.nav.family },
            { href: '/blog', label: t.nav.blog },
            { href: '/lien-he', label: t.nav.contact },
          ]}
        />

        <FooterCol
          title={t.footer.categories}
          links={[
            { href: '/blog?category=kien-thuc-nen-tang', label: t.home.topics[0].title },
            { href: '/blog?category=tieu-chuan-quy-dinh', label: t.home.topics[1].title },
            { href: '/blog?category=phan-mem-cong-cu', label: t.home.topics[2].title },
            { href: '/blog?category=case-study', label: t.home.topics[4].title },
            { href: '/khoa-hoc', label: t.common.viewAll + ' ' + t.nav.courses.toLowerCase() },
          ]}
        />

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{t.footer.contactTitle}</h4>
          <ul className="space-y-3 text-sm text-ink-400">
            {settings.address ? (
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-500" /> {settings.address}
              </li>
            ) : null}
            {settings.phone ? (
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-accent-500" /> {settings.phone}
              </li>
            ) : null}
            {settings.email ? (
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-accent-500" /> {settings.email}
              </li>
            ) : null}
            <li className="flex items-center gap-2">
              <Clock size={16} className="shrink-0 text-accent-500" /> {t.footer.workingHours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-wide flex flex-col items-center justify-between gap-3 text-xs text-ink-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. {t.footer.rights}
          </p>
          <div className="flex gap-4">
            <Link href="/gioi-thieu" className="hover:text-white">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/gioi-thieu" className="hover:text-white">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-ink-400 hover:text-accent-500">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:border-accent-500 hover:bg-accent-500"
    >
      {icon}
    </a>
  );
}
