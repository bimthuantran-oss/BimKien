import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Bạn cần đăng nhập để đăng ký khóa học' }, { status: 401 });
  }
  const { courseId } = await req.json().catch(() => ({ courseId: null }));
  if (!courseId) return NextResponse.json({ error: 'Thiếu courseId' }, { status: 400 });

  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (existing) return NextResponse.json({ enrolled: true });

  await db.enrollment.create({ data: { userId: session.user.id, courseId } });
  return NextResponse.json({ enrolled: true });
}
