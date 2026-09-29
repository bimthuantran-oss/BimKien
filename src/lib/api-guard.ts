import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/** Returns a 401/403 NextResponse if the caller is not staff, otherwise null. */
export async function requireStaffApi() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  if (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR') {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }
  return null;
}

export async function requireAdminApi() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Chỉ quản trị viên mới có quyền này' }, { status: 403 });
  }
  return null;
}
