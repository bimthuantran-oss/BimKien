import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Bạn cần đăng nhập' }, { status: 401 });
  }
  const { lessonId, completed } = await req.json().catch(() => ({ lessonId: null, completed: true }));
  if (!lessonId) return NextResponse.json({ error: 'Thiếu lessonId' }, { status: 400 });

  const progress = await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: { completed: Boolean(completed), completedAt: completed ? new Date() : null },
    create: {
      userId: session.user.id,
      lessonId,
      completed: Boolean(completed),
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ progress });
}
