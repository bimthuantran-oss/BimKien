'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function saveStatItems(formData: FormData) {
  await requireAdmin();

  const ids = formData.getAll('id') as string[];

  for (const id of ids) {
    await db.statItem.update({
      where: { id },
      data: {
        icon: String(formData.get(`icon-${id}`) || 'Award'),
        value: String(formData.get(`value-${id}`) || ''),
        label: String(formData.get(`label-${id}`) || ''),
        labelEn: String(formData.get(`labelEn-${id}`) || '').trim() || null,
      },
    });
  }

  revalidatePath('/', 'layout');
}
