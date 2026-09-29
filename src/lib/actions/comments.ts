'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/admin-auth';

export async function updateCommentStatus(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || 'APPROVED') as 'PENDING' | 'APPROVED' | 'HIDDEN';
  if (!id) return;
  await db.comment.update({ where: { id }, data: { status } });
  revalidatePath('/admin/binh-luan');
}

export async function deleteComment(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.comment.delete({ where: { id } });
  revalidatePath('/admin/binh-luan');
}
