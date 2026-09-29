'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/admin-auth';
import { saveUploadedFile } from '@/lib/upload';
import { slugify } from '@/lib/utils';

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || 'bai-viet';
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

export async function savePost(formData: FormData) {
  const session = await requireStaff();

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const titleEn = String(formData.get('titleEn') || '').trim() || null;
  const excerpt = String(formData.get('excerpt') || '').trim();
  const excerptEn = String(formData.get('excerptEn') || '').trim() || null;
  const content = String(formData.get('content') || '');
  const contentEn = String(formData.get('contentEn') || '').trim() || null;
  const categoryId = String(formData.get('categoryId') || '') || null;
  const tagsRaw = String(formData.get('tags') || '');
  const status = String(formData.get('status') || 'DRAFT') as 'DRAFT' | 'PUBLISHED';
  const metaTitle = String(formData.get('metaTitle') || '') || null;
  const metaTitleEn = String(formData.get('metaTitleEn') || '').trim() || null;
  const metaDescription = String(formData.get('metaDescription') || '') || null;
  const metaDescriptionEn = String(formData.get('metaDescriptionEn') || '').trim() || null;
  const coverFile = formData.get('coverImage');
  const existingCover = String(formData.get('existingCoverImage') || '') || null;

  if (!title || !excerpt || !content) {
    throw new Error('Vui lòng nhập đầy đủ tiêu đề, mô tả ngắn và nội dung');
  }

  let coverImage = existingCover;
  if (coverFile instanceof File && coverFile.size > 0) {
    coverImage = await saveUploadedFile(coverFile, 'covers');
  }

  const tagNames = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const tagConnectOrCreate = tagNames.map((name) => ({
    where: { slug: slugify(name) },
    create: { name, slug: slugify(name) },
  }));

  const slug = await uniqueSlug(title, id || undefined);

  const data = {
    title,
    titleEn,
    slug,
    excerpt,
    excerptEn,
    content,
    contentEn,
    coverImage,
    categoryId,
    status,
    metaTitle,
    metaTitleEn,
    metaDescription,
    metaDescriptionEn,
    publishedAt: status === 'PUBLISHED' ? new Date() : null,
    tags: { set: [], connectOrCreate: tagConnectOrCreate },
  };

  if (id) {
    await db.post.update({ where: { id }, data });
  } else {
    await db.post.create({ data: { ...data, authorId: session.user.id } });
  }

  revalidatePath('/admin/bai-viet');
  revalidatePath('/blog');
  redirect('/admin/bai-viet');
}

export async function deletePost(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.post.delete({ where: { id } });
  revalidatePath('/admin/bai-viet');
  revalidatePath('/blog');
}

export async function saveCategory(formData: FormData) {
  await requireStaff();
  const name = String(formData.get('name') || '').trim();
  const nameEn = String(formData.get('nameEn') || '').trim() || null;
  if (!name) return;
  const slug = slugify(name);
  await db.category.upsert({
    where: { slug },
    update: { name, nameEn },
    create: { name, nameEn, slug },
  });
  revalidatePath('/admin/bai-viet');
}
