'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { AdminMobileNav } from './AdminMobileNav';

const TITLES: Record<string, string> = {
  '/admin': 'Tổng quan',
  '/admin/bai-viet': 'Bài viết',
  '/admin/du-an': 'Dự án',
  '/admin/khoa-hoc': 'Khóa học',
  '/admin/family': 'Family Revit',
  '/admin/family/yeu-cau': 'Yêu cầu mua Family',
  '/admin/nguoi-dung': 'Người dùng',
  '/admin/binh-luan': 'Bình luận',
  '/admin/lien-he': 'Liên hệ',
  '/admin/cai-dat': 'Cài đặt',
};

function resolveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  const base = '/' + pathname.split('/').slice(1, 3).join('/');
  return TITLES[base] ?? 'Quản trị';
}

export function AdminTopbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = resolveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button className="text-ink-700 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <Menu />
        </button>
        <h1 className="font-display text-lg font-bold text-ink-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-ink-900">{session?.user?.name}</p>
          <p className="text-xs text-ink-400">{session?.user?.role === 'ADMIN' ? 'Quản trị viên' : 'Biên tập viên'}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
          {session?.user?.name?.[0]?.toUpperCase() ?? 'A'}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-red-50 hover:text-red-600"
          aria-label="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>

      {mobileOpen ? <AdminMobileNav onClose={() => setMobileOpen(false)} /> : null}
    </header>
  );
}
