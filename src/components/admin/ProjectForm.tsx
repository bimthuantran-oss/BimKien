'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { saveProject, deleteProjectImage } from '@/lib/actions/projects';
import { PROJECT_TYPES } from '@/lib/constants';

type ProjectInitial = {
  id: string;
  title: string;
  titleEn: string | null;
  summary: string;
  summaryEn: string | null;
  content: string;
  contentEn: string | null;
  projectType: string;
  investor: string | null;
  location: string | null;
  scale: string | null;
  completedYear: number | null;
  bimModelUrl: string | null;
  status: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaTitleEn: string | null;
  metaDescription: string | null;
  metaDescriptionEn: string | null;
  images: { id: string; url: string; caption: string | null }[];
};

export function ProjectForm({ initial }: { initial?: ProjectInitial }) {
  const [content, setContent] = useState(initial?.content ?? '');
  const [contentEn, setContentEn] = useState(initial?.contentEn ?? '');
  const [coverPreview, setCoverPreview] = useState<string | null>(initial?.coverImage ?? null);

  return (
    <form action={saveProject} className="space-y-6">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="contentEn" value={contentEn} />
      <input type="hidden" name="existingCoverImage" value={coverPreview ?? ''} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-4 p-6">
            <Field label="Tên dự án">
              <input
                name="title"
                required
                defaultValue={initial?.title}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả ngắn">
              <textarea
                name="summary"
                required
                rows={2}
                defaultValue={initial?.summary}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Nội dung chi tiết">
              <RichTextEditor value={content} onChange={setContent} />
            </Field>
          </div>

          <div className="card-surface space-y-4 border border-dashed border-accent-300 p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-accent-600">
              🇬🇧 Bản dịch tiếng Anh <span className="font-normal normal-case text-ink-400">(không bắt buộc)</span>
            </h3>
            <Field label="Tên dự án (Tiếng Anh)">
              <input
                name="titleEn"
                defaultValue={initial?.titleEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả ngắn (Tiếng Anh)">
              <textarea
                name="summaryEn"
                rows={2}
                defaultValue={initial?.summaryEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Nội dung chi tiết (Tiếng Anh)">
              <RichTextEditor value={contentEn} onChange={setContentEn} placeholder="Enter English content..." />
            </Field>
          </div>

          <div className="card-surface space-y-4 p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">Thư viện ảnh</h3>
            {initial && initial.images.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {initial.images.map((img) => (
                  <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg">
                    <Image src={img.url} alt="" fill className="object-cover" />
                    <form action={deleteProjectImage} className="absolute right-1 top-1">
                      <input type="hidden" name="id" value={img.id} />
                      <input type="hidden" name="projectId" value={initial.id} />
                      <button className="rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Trash2 size={13} />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : null}
            <Field label="Thêm ảnh vào thư viện">
              <input type="file" name="galleryImages" accept="image/*" multiple className="w-full text-sm" />
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
            <Field label="Loại công trình">
              <select
                name="projectType"
                defaultValue={initial?.projectType ?? 'dan-dung'}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              >
                {Object.entries(PROJECT_TYPES).map(([slug, label]) => (
                  <option key={slug} value={slug}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Chủ đầu tư">
              <input
                name="investor"
                defaultValue={initial?.investor ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Địa điểm">
              <input
                name="location"
                defaultValue={initial?.location ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Quy mô">
              <input
                name="scale"
                defaultValue={initial?.scale ?? ''}
                placeholder="VD: 12.000 m²"
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Năm hoàn thành">
              <input
                type="number"
                name="completedYear"
                defaultValue={initial?.completedYear ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="URL nhúng mô hình BIM (tuỳ chọn)">
              <input
                name="bimModelUrl"
                defaultValue={initial?.bimModelUrl ?? ''}
                placeholder="https://..."
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
          </div>

          <div className="card-surface space-y-3 p-6">
            <Field label="Ảnh bìa">
              {coverPreview ? (
                <div className="relative mb-2 aspect-video overflow-hidden rounded-lg bg-ink-100">
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
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
            {initial ? 'Cập nhật dự án' : 'Tạo dự án'}
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
