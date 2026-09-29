import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { readPrivateFile } from '@/lib/upload';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Bạn cần đăng nhập để tải family' }, { status: 401 });
  }

  const family = await db.family.findUnique({ where: { id: params.id } });
  if (!family || family.status !== 'PUBLISHED' || !family.fileUrl) {
    return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 404 });
  }

  if (family.price > 0) {
    const access = await db.familyAccess.findUnique({
      where: { userId_familyId: { userId: session.user.id, familyId: family.id } },
    });
    if (!access) {
      return NextResponse.json({ error: 'Bạn chưa được cấp quyền tải family này' }, { status: 403 });
    }
  }

  const buffer = await readPrivateFile(family.fileUrl);

  db.family.update({ where: { id: family.id }, data: { downloadCount: { increment: 1 } } }).catch(() => {});
  db.familyDownload.create({ data: { userId: session.user.id, familyId: family.id } }).catch(() => {});

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(family.fileName || `${family.slug}.rfa`)}"`,
      'Content-Length': String(buffer.byteLength),
    },
  });
}
