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
  X,
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

export function AdminMobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex w-72 flex-col bg-ink-950">
        <div className="flex h-16 items-center justify-between border-b border-ink-800 px-5">
          <span className="font-display text-lg font-extrabold text-white">Admin</span>
          <button onClick={onClose} className="text-white">
            <X />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white',
                  active && 'bg-accent-500/15 text-accent-500'
                )}
              >
                <item.icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
