'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { savePost } from '@/lib/actions/posts';

type Category = { id: string; name: string };
type PostInitial = {
  id: string;
  title: string;
  titleEn: string | null;
  excerpt: string;
  excerptEn: string | null;
  content: string;
  contentEn: string | null;
  categoryId: string | null;
  tags: { name: string }[];
  status: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaTitleEn: string | null;
  metaDescription: string | null;
  metaDescriptionEn: string | null;
};

export function PostForm({ categories, initial }: { categories: Category[]; initial?: PostInitial }) {
  const [content, setContent] = useState(initial?.content ?? '');
  const [contentEn, setContentEn] = useState(initial?.contentEn ?? '');
  const [coverPreview, setCoverPreview] = useState<string | null>(initial?.coverImage ?? null);

  return (
    <form action={savePost} className="space-y-6">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="contentEn" value={contentEn} />
      <input type="hidden" name="existingCoverImage" value={coverPreview ?? ''} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-4 p-6">
            <Field label="Tiêu đề">
              <input
                name="title"
                required
                defaultValue={initial?.title}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả ngắn (excerpt)">
              <textarea
                name="excerpt"
                required
                rows={2}
                defaultValue={initial?.excerpt}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Nội dung">
              <RichTextEditor value={content} onChange={setContent} />
            </Field>
          </div>

          <div className="card-surface space-y-4 border border-dashed border-accent-300 p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-accent-600">
              🇬🇧 Bản dịch tiếng Anh <span className="font-normal normal-case text-ink-400">(không bắt buộc)</span>
            </h3>
            <Field label="Tiêu đề (Tiếng Anh)">
              <input
                name="titleEn"
                defaultValue={initial?.titleEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả ngắn (Tiếng Anh)">
              <textarea
                name="excerptEn"
                rows={2}
                defaultValue={initial?.excerptEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Nội dung (Tiếng Anh)">
              <RichTextEditor value={contentEn} onChange={setContentEn} placeholder="Enter English content..." />
            </Field>
          </div>

          <div className="card-surface space-y-4 p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">SEO</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Meta title">
                <input
                  name="metaTitle"
                  defaultValue={initial?.metaTitle ?? ''}
                  className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
                />
              </Field>
              <Field label="Meta title (Tiếng Anh)">
                <input
                  name="metaTitleEn"
                  defaultValue={initial?.metaTitleEn ?? ''}
                  className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Meta description">
                <textarea
                  name="metaDescription"
                  rows={2}
                  defaultValue={initial?.metaDescription ?? ''}
                  className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
                />
              </Field>
              <Field label="Meta description (Tiếng Anh)">
                <textarea
                  name="metaDescriptionEn"
                  rows={2}
                  defaultValue={initial?.metaDescriptionEn ?? ''}
                  className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface space-y-4 p-6">
            <Field label="Trạng thái">
              <select
                name="status"
                defaultValue={initial?.status ?? 'DRAFT'}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              >
                <option value="DRAFT">Nháp</option>
                <option value="PUBLISHED">Xuất bản</option>
              </select>
            </Field>
            <Field label="Chuyên mục">
              <select
                name="categoryId"
                defaultValue={initial?.categoryId ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              >
                <option value="">— Không —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tags (phân cách bằng dấu phẩy)">
              <input
                name="tags"
                defaultValue={initial?.tags.map((t) => t.name).join(', ')}
                placeholder="Revit, Clash Detection"
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
          </div>

          <div className="card-surface space-y-3 p-6">
            <Field label="Ảnh bìa">
              {coverPreview ? (
                <div className="relative mb-2 aspect-video overflow-hidden rounded-lg bg-ink-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="Cover" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ) : null}
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCoverPreview(URL.createObjectURL(file));
                }}
                className="w-full text-sm"
              />
            </Field>
          </div>

          <button type="submit" className="btn-primary w-full">
            {initial ? 'Cập nhật bài viết' : 'Tạo bài viết'}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</label>
      {children}
    </div>
  );
}
