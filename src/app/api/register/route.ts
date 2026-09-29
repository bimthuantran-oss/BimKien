import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { registerSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ' }, { status: 400 });
  }

  const { name, email, phone, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email này đã được đăng ký' }, { status: 409 });
  }

  const phoneTaken = await db.user.findFirst({ where: { phone } });
  if (phoneTaken) {
    return NextResponse.json({ error: 'Số điện thoại này đã được đăng ký' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.create({
    data: { name, email, phone, passwordHash, role: 'STUDENT' },
  });

  return NextResponse.json({ ok: true });
}
