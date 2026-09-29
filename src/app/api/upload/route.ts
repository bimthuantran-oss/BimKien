import { NextResponse } from 'next/server';
import { requireStaffApi } from '@/lib/api-guard';
import { saveUploadedFile } from '@/lib/upload';

export async function POST(req: Request) {
  const guard = await requireStaffApi();
  if (guard) return guard;

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Thiếu file' }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'File tối đa 8MB' }, { status: 400 });
  }

  const url = await saveUploadedFile(file, 'covers');
  return NextResponse.json({ url });
}
