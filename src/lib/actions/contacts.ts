'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/admin-auth';

export async function replyContact(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const adminReply = String(formData.get('adminReply') || '').trim();
  if (!id || !adminReply) return;
  await db.contact.update({
    where: { id },
    data: { adminReply, status: 'REPLIED', repliedAt: new Date() },
  });
  revalidatePath('/admin/lien-he');
}

export async function updateContactStatus(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || 'NEW') as 'NEW' | 'REPLIED' | 'ARCHIVED';
  if (!id) return;
  await db.contact.update({ where: { id }, data: { status } });
  revalidatePath('/admin/lien-he');
}
