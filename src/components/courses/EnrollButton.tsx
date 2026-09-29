'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

export function EnrollButton({
  courseId,
  firstLessonHref,
  initialEnrolled,
}: {
  courseId: string;
  firstLessonHref: string;
  initialEnrolled: boolean;
}) {
  const { data: session } = useSession();
  const { t } = useLocale();
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [loading, setLoading] = useState(false);

  if (enrolled) {
    return (
      <Link href={firstLessonHref} className="btn-primary w-full sm:w-auto">
        <PlayCircle size={18} /> {t.courses.startLearning}
      </Link>
    );
  }

  async function enroll() {
    if (!session) {
      router.push('/dang-nhap');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) setEnrolled(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={enroll} disabled={loading} className="btn-primary w-full disabled:opacity-50 sm:w-auto">
      {loading ? t.common.loading : t.courses.enroll}
    </button>
  );
}
