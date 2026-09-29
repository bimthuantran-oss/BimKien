'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

export function LessonCompleteToggle({ lessonId, initialCompleted }: { lessonId: string; initialCompleted: boolean }) {
  const { t } = useLocale();
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = !completed;
    setCompleted(next);
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, completed: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`btn ${completed ? 'bg-accent-50 text-accent-600 border border-accent-500' : 'btn-primary'}`}
    >
      {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      {completed ? t.courses.completed : t.courses.markComplete}
    </button>
  );
}
