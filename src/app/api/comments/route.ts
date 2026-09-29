import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { commentSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Bạn cần đăng nhập để bình luận' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' }, { status: 400 });
  }
  const { content, postId, courseId, parentId } = parsed.data;
  if (!postId && !courseId) {
    return NextResponse.json({ error: 'Thiếu bài viết hoặc khóa học' }, { status: 400 });
  }

  const comment = await db.comment.create({
    data: {
      content,
      authorId: session.user.id,
      postId,
      courseId,
      parentId,
    },
    include: { author: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ comment });
}
