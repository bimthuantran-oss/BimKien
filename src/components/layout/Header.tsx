'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, BookOpenCheck, Heart, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { LogoMark } from '@/components/ui/LogoMark';

export function Header({ siteName, logoUrl }: { siteName: string; logoUrl?: string | null }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const NAV = [
    { href: '/', label: t.nav.home },
    { href: '/gioi-thieu', label: t.nav.about },
    { href: '/du-an', label: t.nav.projects },
    { href: '/khoa-hoc', label: t.nav.courses },
    { href: '/family', label: t.nav.family },
    { href: '/blog', label: t.nav.blog },
    { href: '/lien-he', label: t.nav.contact },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const isStaff = session?.user?.role === 'ADMIN' || session?.user?.role === 'EDITOR';

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/95 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={32} height={32} className="rounded" />
          ) : (
            <LogoMark className="h-9 w-9" />
          )}
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-semibold uppercase tracking-wide text-ink-200 transition-colors hover:text-accent-500',
                isActive(item.href) && 'text-accent-500'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white hover:border-accent-500"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
                {session.user?.name?.split(' ').slice(-1)}
                <ChevronDown size={14} />
              </button>
              {userMenuOpen ? (
                <div
                  className="absolute right-0 top-12 w-56 rounded-lg border border-ink-100 bg-white p-2 shadow-card"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <Link href="/tai-khoan" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
                    <BookOpenCheck size={16} /> {t.nav.myCourses}
                  </Link>
                  <Link href="/tai-khoan/yeu-thich" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
                    <Heart size={16} /> {t.nav.favorites}
                  </Link>
                  <Link href="/tai-khoan/family" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
                    <Boxes size={16} /> {t.nav.myFamilies}
                  </Link>
                  {isStaff ? (
                    <Link href="/admin" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink-700 hover:bg-ink-50">
                      <LayoutDashboard size={16} /> {t.nav.admin}
                    </Link>
                  ) : null}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> {t.nav.logout}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link href="/dang-nhap" className="text-sm font-semibold text-ink-200 hover:text-white">
                {t.nav.login}
              </Link>
              <Link href="/dang-ky" className="btn-primary">
                {t.nav.register}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button className="text-white" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-ink-950 lg:hidden">
          <nav className="container-wide flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink-200 hover:bg-white/5 hover:text-accent-500',
                  isActive(item.href) && 'text-accent-500'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
              {session ? (
                <>
                  {isStaff ? (
                    <Link href="/admin" className="btn-outline text-center">
                      {t.nav.admin}
                    </Link>
                  ) : null}
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-outline">
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/dang-nhap" onClick={() => setOpen(false)} className="btn-outline text-center">
                    {t.nav.login}
                  </Link>
                  <Link href="/dang-ky" onClick={() => setOpen(false)} className="btn-primary text-center">
                    {t.nav.register}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
