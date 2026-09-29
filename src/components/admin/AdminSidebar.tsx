'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Building2,
  GraduationCap,
  Boxes,
  ClipboardList,
  Users,
  MessageSquare,
  Mail,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { href: '/admin/bai-viet', label: 'Bài viết', icon: FileText },
  { href: '/admin/du-an', label: 'Dự án', icon: Building2 },
  { href: '/admin/khoa-hoc', label: 'Khóa học', icon: GraduationCap },
  { href: '/admin/family', label: 'Family Revit', icon: Boxes },
  { href: '/admin/family/yeu-cau', label: 'Yêu cầu mua Family', icon: ClipboardList },
  { href: '/admin/nguoi-dung', label: 'Người dùng', icon: Users },
  { href: '/admin/binh-luan', label: 'Bình luận', icon: MessageSquare },
  { href: '/admin/lien-he', label: 'Liên hệ', icon: Mail },
  { href: '/admin/cai-dat', label: 'Cài đặt', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-800 bg-ink-950 lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-ink-800 px-6 font-display text-lg font-extrabold text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-500 text-sm">B</span>
        Admin
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 transition-colors hover:bg-white/5 hover:text-white',
                active && 'bg-accent-500/15 text-accent-500'
              )}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-ink-800 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-400 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={16} /> Xem trang web
        </Link>
      </div>
    </aside>
  );
}
