'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/admin-auth';
import { saveUploadedFile } from '@/lib/upload';
import { slugify } from '@/lib/utils';

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || 'du-an';
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.project.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

export async function saveProject(formData: FormData) {
  await requireStaff();

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const titleEn = String(formData.get('titleEn') || '').trim() || null;
  const summary = String(formData.get('summary') || '').trim();
  const summaryEn = String(formData.get('summaryEn') || '').trim() || null;
  const content = String(formData.get('content') || '');
  const contentEn = String(formData.get('contentEn') || '').trim() || null;
  const projectType = String(formData.get('projectType') || 'dan-dung');
  const investor = String(formData.get('investor') || '') || null;
  const location = String(formData.get('location') || '') || null;
  const scale = String(formData.get('scale') || '') || null;
  const completedYearRaw = String(formData.get('completedYear') || '');
  const completedYear = completedYearRaw ? Number(completedYearRaw) : null;
  const bimModelUrl = String(formData.get('bimModelUrl') || '') || null;
  const status = String(formData.get('status') || 'DRAFT') as 'DRAFT' | 'PUBLISHED';
  const metaTitle = String(formData.get('metaTitle') || '') || null;
  const metaTitleEn = String(formData.get('metaTitleEn') || '').trim() || null;
  const metaDescription = String(formData.get('metaDescription') || '') || null;
  const metaDescriptionEn = String(formData.get('metaDescriptionEn') || '').trim() || null;

  const coverFile = formData.get('coverImage');
  const existingCover = String(formData.get('existingCoverImage') || '') || null;

  if (!title || !summary || !content) {
    throw new Error('Vui lòng nhập đầy đủ tiêu đề, mô tả ngắn và nội dung');
  }

  let coverImage = existingCover;
  if (coverFile instanceof File && coverFile.size > 0) {
    coverImage = await saveUploadedFile(coverFile, 'covers');
  }

  const slug = await uniqueSlug(title, id || undefined);

  const data = {
    title,
    titleEn,
    slug,
    summary,
    summaryEn,
    content,
    contentEn,
    coverImage,
    projectType,
    investor,
    location,
    scale,
    completedYear,
    bimModelUrl,
    status,
    metaTitle,
    metaTitleEn,
    metaDescription,
    metaDescriptionEn,
  };

  let projectId = id;
  if (id) {
    await db.project.update({ where: { id }, data });
  } else {
    const created = await db.project.create({ data });
    projectId = created.id;
  }

  const galleryFiles = formData.getAll('galleryImages').filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of galleryFiles) {
    const url = await saveUploadedFile(file, 'gallery');
    await db.projectImage.create({ data: { projectId, url, order: 0 } });
  }

  revalidatePath('/admin/du-an');
  revalidatePath('/du-an');
  redirect('/admin/du-an');
}

export async function deleteProject(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.project.delete({ where: { id } });
  revalidatePath('/admin/du-an');
  revalidatePath('/du-an');
}

export async function deleteProjectImage(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const projectId = String(formData.get('projectId') || '');
  if (!id) return;
  await db.projectImage.delete({ where: { id } });
  revalidatePath(`/admin/du-an/${projectId}`);
}
