'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/components/providers/LocaleProvider';

export function FavoriteButton({ postId, initialFavorited }: { postId: string; initialFavorited: boolean }) {
  const { data: session } = useSession();
  const { t } = useLocale();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!session) {
      router.push('/dang-nhap');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) setFavorited(data.favorited);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
        favorited ? 'border-accent-500 bg-accent-50 text-accent-600' : 'border-ink-200 text-ink-600 hover:border-accent-500'
      )}
    >
      <Heart size={16} className={favorited ? 'fill-accent-500 text-accent-500' : ''} />
      {favorited ? t.blog.saved : t.blog.saveArticle}
    </button>
  );
}
