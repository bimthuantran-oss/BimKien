'use client';

import { useState } from 'react';
import { FileBox } from 'lucide-react';
import { saveFamily } from '@/lib/actions/families';

type Category = { id: string; name: string };
type FamilyInitial = {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  categoryId: string | null;
  softwareInfo: string | null;
  price: number;
  status: string;
  previewImage: string | null;
  fileName: string | null;
  metaTitle: string | null;
  metaTitleEn: string | null;
  metaDescription: string | null;
  metaDescriptionEn: string | null;
};

export function FamilyForm({ categories, initial }: { categories: Category[]; initial?: FamilyInitial }) {
  const [previewImg, setPreviewImg] = useState<string | null>(initial?.previewImage ?? null);

  return (
    <form action={saveFamily} className="space-y-6">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="existingPreviewImage" value={previewImg ?? ''} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-surface space-y-4 p-6">
            <Field label="Tên family">
              <input
                name="title"
                required
                defaultValue={initial?.title}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả">
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={initial?.description}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Thông tin phần mềm (VD: Revit 2021 trở lên)">
              <input
                name="softwareInfo"
                defaultValue={initial?.softwareInfo ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
          </div>

          <div className="card-surface space-y-4 border border-dashed border-accent-300 p-6">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-accent-600">
              🇬🇧 Bản dịch tiếng Anh <span className="font-normal normal-case text-ink-400">(không bắt buộc)</span>
            </h3>
            <Field label="Tên family (Tiếng Anh)">
              <input
                name="titleEn"
                defaultValue={initial?.titleEn ?? ''}
                className="w-full rounded-lg border border-ink-200 p-3 text-sm focus:border-accent-500 focus:outline-none"
              />
            </Field>
            <Field label="Mô tả (Tiếng Anh)">
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
            <Field label="Danh mục">
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
            <Field label="Ảnh xem trước">
              {previewImg ? (
                <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-ink-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImg} alt="Preview" className="absolute inset-0 h-full w-full object-contain p-2" />
                </div>
              ) : null}
              <input
                type="file"
                name="previewImage"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreviewImg(URL.createObjectURL(file));
                }}
                className="w-full text-sm"
              />
            </Field>
          </div>

          <div className="card-surface space-y-3 p-6">
            <Field label="File family (.rfa / .zip)">
              {initial?.fileName ? (
                <p className="mb-2 flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">
                  <FileBox size={14} /> Hiện tại: {initial.fileName}
                </p>
              ) : null}
              <input type="file" name="familyFile" accept=".rfa,.rvt,.zip" className="w-full text-sm" />
              <p className="mt-1 text-xs text-ink-400">Để trống nếu không muốn thay file đã tải lên.</p>
            </Field>
          </div>

          <button type="submit" className="btn-primary w-full">
            {initial ? 'Cập nhật family' : 'Tạo family'}
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
