'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function updateUserRole(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  const role = String(formData.get('role') || 'STUDENT') as 'ADMIN' | 'EDITOR' | 'STUDENT';
  if (!id) return;
  await db.user.update({ where: { id }, data: { role } });
  revalidatePath('/admin/nguoi-dung');
}

export async function toggleUserBan(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') || '');
  const isBanned = String(formData.get('isBanned') || 'false') === 'true';
  if (!id) return;
  await db.user.update({ where: { id }, data: { isBanned: !isBanned } });
  revalidatePath('/admin/nguoi-dung');
}
