import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Bạn cần đăng nhập' }, { status: 401 });
  }
  const { postId } = await req.json().catch(() => ({ postId: null }));
  if (!postId) return NextResponse.json({ error: 'Thiếu postId' }, { status: 400 });

  const existing = await db.favoritePost.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });

  if (existing) {
    await db.favoritePost.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await db.favoritePost.create({ data: { userId: session.user.id, postId } });
  return NextResponse.json({ favorited: true });
}
