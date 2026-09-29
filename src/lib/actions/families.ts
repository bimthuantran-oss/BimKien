'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { requireStaff } from '@/lib/admin-auth';
import { saveUploadedFile, savePrivateFile } from '@/lib/upload';
import { slugify } from '@/lib/utils';

async function uniqueFamilySlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || 'family';
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.family.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

export async function saveFamily(formData: FormData) {
  await requireStaff();

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const titleEn = String(formData.get('titleEn') || '').trim() || null;
  const description = String(formData.get('description') || '').trim();
  const descriptionEn = String(formData.get('descriptionEn') || '').trim() || null;
  const categoryId = String(formData.get('categoryId') || '') || null;
  const softwareInfo = String(formData.get('softwareInfo') || '') || null;
  const price = Number(formData.get('price') || 0);
  const status = String(formData.get('status') || 'DRAFT') as 'DRAFT' | 'PUBLISHED';
  const metaTitle = String(formData.get('metaTitle') || '') || null;
  const metaTitleEn = String(formData.get('metaTitleEn') || '').trim() || null;
  const metaDescription = String(formData.get('metaDescription') || '') || null;
  const metaDescriptionEn = String(formData.get('metaDescriptionEn') || '').trim() || null;

  const previewFile = formData.get('previewImage');
  const existingPreview = String(formData.get('existingPreviewImage') || '') || null;
  const familyFile = formData.get('familyFile');

  if (!title || !description) {
    throw new Error('Vui lòng nhập đầy đủ tên và mô tả family');
  }

  let previewImage = existingPreview;
  if (previewFile instanceof File && previewFile.size > 0) {
    previewImage = await saveUploadedFile(previewFile, 'covers');
  }

  const data: Record<string, unknown> = {
    title,
    titleEn,
    description,
    descriptionEn,
    categoryId,
    softwareInfo,
    price,
    status,
    metaTitle,
    metaTitleEn,
    metaDescription,
    metaDescriptionEn,
  };

  if (familyFile instanceof File && familyFile.size > 0) {
    const saved = await savePrivateFile(familyFile, 'families');
    data.fileUrl = saved.storagePath;
    data.fileName = saved.originalName;
    data.fileSize = saved.size;
  }

  let familyId = id;
  if (id) {
    if (previewImage !== undefined) data.previewImage = previewImage;
    await db.family.update({ where: { id }, data });
  } else {
    const slug = await uniqueFamilySlug(title);
    const created = await db.family.create({ data: { ...data, slug, previewImage } as never });
    familyId = created.id;
  }

  revalidatePath('/admin/family');
  revalidatePath('/family');
  redirect('/admin/family');
}

export async function deleteFamily(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.family.delete({ where: { id } });
  revalidatePath('/admin/family');
  revalidatePath('/family');
}

export async function saveFamilyCategory(formData: FormData) {
  await requireStaff();
  const name = String(formData.get('name') || '').trim();
  const nameEn = String(formData.get('nameEn') || '').trim() || null;
  if (!name) return;
  const slug = slugify(name);
  await db.familyCategory.upsert({ where: { slug }, update: { name, nameEn }, create: { name, nameEn, slug } });
  revalidatePath('/admin/family');
}

export async function deleteFamilyCategory(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.familyCategory.delete({ where: { id } });
  revalidatePath('/admin/family');
}

// ---------- User-facing ----------

export async function requestFamilyPurchase(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect('/dang-nhap');

  const familyId = String(formData.get('familyId') || '');
  const note = String(formData.get('note') || '') || null;
  if (!familyId) return;

  const existing = await db.familyPurchaseRequest.findFirst({
    where: { userId: session.user.id, familyId, status: 'PENDING' },
  });
  if (!existing) {
    await db.familyPurchaseRequest.create({ data: { userId: session.user.id, familyId, note } });
  }

  const family = await db.family.findUnique({ where: { id: familyId }, select: { slug: true } });
  revalidatePath(`/family/${family?.slug}`);
  redirect(`/family/${family?.slug}?requested=1`);
}

export async function approveFamilyPurchase(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;

  const request = await db.familyPurchaseRequest.update({
    where: { id },
    data: { status: 'APPROVED', respondedAt: new Date() },
  });

  await db.familyAccess.upsert({
    where: { userId_familyId: { userId: request.userId, familyId: request.familyId } },
    update: {},
    create: { userId: request.userId, familyId: request.familyId },
  });

  revalidatePath('/admin/family/yeu-cau');
}

export async function rejectFamilyPurchase(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.familyPurchaseRequest.update({ where: { id }, data: { status: 'REJECTED', respondedAt: new Date() } });
  revalidatePath('/admin/family/yeu-cau');
}
