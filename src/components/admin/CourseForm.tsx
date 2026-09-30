'use client';

import { useState } from 'react';
import { saveCourse } from '@/lib/actions/courses';
import { COURSE_LEVEL_LABEL } from '@/lib/constants';

type CourseInitial = {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  level: string;
  price: number;
  status: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaTitleEn: string | null;
  metaDescription: string | null;
  metaDescriptionEn: string | null;
};

export function CourseForm({ initial }: { initial?: CourseInitial }) {
  const [coverPreview, setCoverPreview] = useState<string | null>(initial?.coverImage ?? null);

  return (
    <form action={saveCourse} className="space-y-6">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="existingCoverImage" value={coverPreview ?? ''} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-4 p-6">
            <Field label="Tên khóa học">
              <input
                name="title"
                required
                defaultValue={initial?.title}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả khóa học">
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={initial?.description}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
          </div>

          <div className="card-surface space-y-4 border border-dashed border-accent-300 p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-accent-600">
              🇬🇧 Bản dịch tiếng Anh <span className="font-normal normal-case text-ink-400">(không bắt buộc)</span>
            </h3>
            <Field label="Tên khóa học (Tiếng Anh)">
              <input
                name="titleEn"
                defaultValue={initial?.titleEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả khóa học (Tiếng Anh)">
              <textarea
                name="descriptionEn"
                rows={4}
                defaultValue={initial?.descriptionEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
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
            <Field label="Trình độ">
              <select
                name="level"
                defaultValue={initial?.level ?? 'BEGINNER'}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              >
                {Object.entries(COURSE_LEVEL_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Giá (VNĐ, 0 = miễn phí)">
              <input
                type="number"
                name="price"
                min={0}
                defaultValue={initial?.price ?? 0}
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
            {initial ? 'Cập nhật khóa học' : 'Tạo khóa học & thêm bài giảng'}
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
