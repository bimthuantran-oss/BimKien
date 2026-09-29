import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSchema } from '@/lib/validations';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  if (parsed.data.website) {
    // Honeypot triggered — silently accept without persisting.
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, subject, message } = parsed.data;
  await db.contact.create({ data: { name, email, phone: phone || null, subject, message } });

  return NextResponse.json({ ok: true });
}
