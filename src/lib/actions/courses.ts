'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { requireStaff } from '@/lib/admin-auth';
import { saveUploadedFile } from '@/lib/upload';
import { slugify } from '@/lib/utils';

async function uniqueCourseSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || 'khoa-hoc';
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.course.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

export async function saveCourse(formData: FormData) {
  await requireStaff();

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const titleEn = String(formData.get('titleEn') || '').trim() || null;
  const description = String(formData.get('description') || '').trim();
  const descriptionEn = String(formData.get('descriptionEn') || '').trim() || null;
  const level = String(formData.get('level') || 'BEGINNER') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  const price = Number(formData.get('price') || 0);
  const status = String(formData.get('status') || 'DRAFT') as 'DRAFT' | 'PUBLISHED';
  const metaTitle = String(formData.get('metaTitle') || '') || null;
  const metaTitleEn = String(formData.get('metaTitleEn') || '').trim() || null;
  const metaDescription = String(formData.get('metaDescription') || '') || null;
  const metaDescriptionEn = String(formData.get('metaDescriptionEn') || '').trim() || null;
  const coverFile = formData.get('coverImage');
  const existingCover = String(formData.get('existingCoverImage') || '') || null;

  if (!title || !description) {
    throw new Error('Vui lòng nhập đầy đủ tiêu đề và mô tả khóa học');
  }

  let coverImage = existingCover;
  if (coverFile instanceof File && coverFile.size > 0) {
    coverImage = await saveUploadedFile(coverFile, 'covers');
  }

  const slug = await uniqueCourseSlug(title, id || undefined);
  const data = {
    title,
    titleEn,
    slug,
    description,
    descriptionEn,
    level,
    price,
    status,
    metaTitle,
    metaTitleEn,
    metaDescription,
    metaDescriptionEn,
    coverImage,
  };

  let courseId = id;
  if (id) {
    await db.course.update({ where: { id }, data });
  } else {
    const created = await db.course.create({ data });
    courseId = created.id;
  }

  revalidatePath('/admin/khoa-hoc');
  revalidatePath('/khoa-hoc');
  redirect(`/admin/khoa-hoc/${courseId}`);
}

export async function deleteCourse(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  if (!id) return;
  await db.course.delete({ where: { id } });
  revalidatePath('/admin/khoa-hoc');
  revalidatePath('/khoa-hoc');
}

export async function addChapter(formData: FormData) {
  await requireStaff();
  const courseId = String(formData.get('courseId') || '');
  const title = String(formData.get('title') || '').trim();
  if (!courseId || !title) return;
  const count = await db.chapter.count({ where: { courseId } });
  await db.chapter.create({ data: { courseId, title, order: count } });
  revalidatePath(`/admin/khoa-hoc/${courseId}`);
}

export async function renameChapter(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const courseId = String(formData.get('courseId') || '');
  const title = String(formData.get('title') || '').trim();
  const titleEn = String(formData.get('titleEn') || '').trim() || null;
  if (!id || !title) return;
  await db.chapter.update({ where: { id }, data: { title, titleEn } });
  revalidatePath(`/admin/khoa-hoc/${courseId}`);
}

export async function deleteChapter(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const courseId = String(formData.get('courseId') || '');
  if (!id) return;
  await db.chapter.delete({ where: { id } });
  revalidatePath(`/admin/khoa-hoc/${courseId}`);
}

export async function moveChapter(formData: FormData) {
  await requireStaff();
  const courseId = String(formData.get('courseId') || '');
  const id = String(formData.get('id') || '');
  const direction = String(formData.get('direction') || 'up');
  const chapters = await db.chapter.findMany({ where: { courseId }, orderBy: { order: 'asc' } });
  const idx = chapters.findIndex((c) => c.id === id);
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= chapters.length) return;
  await db.$transaction([
    db.chapter.update({ where: { id: chapters[idx].id }, data: { order: chapters[swapIdx].order } }),
    db.chapter.update({ where: { id: chapters[swapIdx].id }, data: { order: chapters[idx].order } }),
  ]);
  revalidatePath(`/admin/khoa-hoc/${courseId}`);
}

export async function addLesson(formData: FormData) {
  await requireStaff();
  const chapterId = String(formData.get('chapterId') || '');
  const courseId = String(formData.get('courseId') || '');
  const title = String(formData.get('title') || '').trim();
  if (!chapterId || !title) return;
  const count = await db.lesson.count({ where: { chapterId } });
  await db.lesson.create({
    data: { chapterId, title, slug: slugify(title) || `bai-${count + 1}`, order: count },
  });
  revalidatePath(`/admin/khoa-hoc/${courseId}`);
}

export async function saveLesson(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const courseId = String(formData.get('courseId') || '');
  const title = String(formData.get('title') || '').trim();
  const titleEn = String(formData.get('titleEn') || '').trim() || null;
  const videoUrl = String(formData.get('videoUrl') || '') || null;
  const content = String(formData.get('content') || '') || null;
  const contentEn = String(formData.get('contentEn') || '').trim() || null;
  const durationRaw = String(formData.get('durationMin') || '');
  const durationMin = durationRaw ? Number(durationRaw) : null;

  if (!id || !title) return;
  await db.lesson.update({ where: { id }, data: { title, titleEn, videoUrl, content, contentEn, durationMin } });

  const attachmentFiles = formData.getAll('attachments').filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of attachmentFiles) {
    const url = await saveUploadedFile(file, 'attachments');
    await db.attachment.create({ data: { lessonId: id, name: file.name, url, fileType: file.type || 'file' } });
  }

  revalidatePath(`/admin/khoa-hoc/${courseId}`);
  redirect(`/admin/khoa-hoc/${courseId}`);
}

export async function deleteLesson(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const courseId = String(formData.get('courseId') || '');
  if (!id) return;
  await db.lesson.delete({ where: { id } });
  revalidatePath(`/admin/khoa-hoc/${courseId}`);
}

export async function deleteAttachment(formData: FormData) {
  await requireStaff();
  const id = String(formData.get('id') || '');
  const lessonId = String(formData.get('lessonId') || '');
  const courseId = String(formData.get('courseId') || '');
  if (!id) return;
  await db.attachment.delete({ where: { id } });
  revalidatePath(`/admin/khoa-hoc/${courseId}/bai-hoc/${lessonId}`);
}

export async function moveLesson(formData: FormData) {
  await requireStaff();
  const chapterId = String(formData.get('chapterId') || '');
  const courseId = String(formData.get('courseId') || '');
  const id = String(formData.get('id') || '');
  const direction = String(formData.get('direction') || 'up');
  const lessons = await db.lesson.findMany({ where: { chapterId }, orderBy: { order: 'asc' } });
  const idx = lessons.findIndex((l) => l.id === id);
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= lessons.length) return;
  await db.$transaction([
    db.lesson.update({ where: { id: lessons[idx].id }, data: { order: lessons[swapIdx].order } }),
    db.lesson.update({ where: { id: lessons[swapIdx].id }, data: { order: lessons[idx].order } }),
  ]);
  revalidatePath(`/admin/khoa-hoc/${courseId}`);
}
