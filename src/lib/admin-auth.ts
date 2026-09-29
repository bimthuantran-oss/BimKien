import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
    redirect('/dang-nhap?next=/admin');
  }
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }
  return session;
}
