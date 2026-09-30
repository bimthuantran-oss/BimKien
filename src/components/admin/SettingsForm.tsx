'use client';

import { useState } from 'react';
import { saveSettings } from '@/lib/actions/settings';
import type { SiteSettings } from '@/lib/settings';

const inputClass =
  'w-full rounded-lg border border-ink-200 p-2.5 text-sm focus:border-accent-500 focus:outline-none';

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logoUrl);
  const [heroPreview, setHeroPreview] = useState<string | null>(settings.heroImage);
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        await saveSettings(formData);
        setSaved(true);
      }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="space-y-6 lg:col-span-2">
        <div className="card-surface space-y-4 p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">Thông tin chung</h3>
          <Field label="Tên website">
            <input name="siteName" defaultValue={settings.siteName} className={inputClass} />
          </Field>
          <Field label="Slogan / mô tả ngắn">
            <textarea name="tagline" defaultValue={settings.tagline} rows={2} className={inputClass} />
          </Field>
          <Field label="Slogan / mô tả ngắn (Tiếng Anh)">
            <textarea name="taglineEn" defaultValue={settings.taglineEn ?? ''} rows={2} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Số điện thoại">
              <input name="phone" defaultValue={settings.phone} className={inputClass} />
            </Field>
            <Field label="Email liên hệ">
              <input name="email" defaultValue={settings.email} className={inputClass} />
            </Field>
          </div>
          <Field label="Địa chỉ">
            <input name="address" defaultValue={settings.address} className={inputClass} />
          </Field>
        </div>

        <div className="card-surface space-y-4 p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">Mạng xã hội</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Facebook">
              <input name="facebookUrl" defaultValue={settings.facebookUrl} className={inputClass} />
            </Field>
            <Field label="YouTube">
              <input name="youtubeUrl" defaultValue={settings.youtubeUrl} className={inputClass} />
            </Field>
            <Field label="LinkedIn">
              <input name="linkedinUrl" defaultValue={settings.linkedinUrl} className={inputClass} />
            </Field>
            <Field label="Zalo">
              <input name="zaloUrl" defaultValue={settings.zaloUrl ?? ''} className={inputClass} />
            </Field>
          </div>
        </div>

        <div className="card-surface space-y-4 p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">Trang chủ (Hero)</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tiêu đề dòng 1">
              <input name="heroTitleLine1" defaultValue={settings.heroTitleLine1} className={inputClass} />
            </Field>
            <Field label="Tiêu đề dòng 2 (màu cam)">
              <input name="heroTitleLine2" defaultValue={settings.heroTitleLine2} className={inputClass} />
            </Field>
          </div>
          <Field label="Mô tả ngắn">
            <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={3} className={inputClass} />
          </Field>

          <div className="rounded-lg border border-dashed border-accent-300 p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent-600">
              🇬🇧 Bản dịch tiếng Anh <span className="font-normal normal-case text-ink-400">(không bắt buộc)</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tiêu đề dòng 1 (Tiếng Anh)">
                <input name="heroTitleLine1En" defaultValue={settings.heroTitleLine1En ?? ''} className={inputClass} />
              </Field>
              <Field label="Tiêu đề dòng 2 (Tiếng Anh)">
                <input name="heroTitleLine2En" defaultValue={settings.heroTitleLine2En ?? ''} className={inputClass} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Mô tả ngắn (Tiếng Anh)">
                <textarea name="heroSubtitleEn" defaultValue={settings.heroSubtitleEn ?? ''} rows={3} className={inputClass} />
              </Field>
            </div>
          </div>

          <Field label="Ảnh nền hero">
            {heroPreview ? (
              <div className="relative mb-2 aspect-video overflow-hidden rounded-lg bg-ink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroPreview} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ) : null}
            <input
              type="file"
              name="heroImage"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setHeroPreview(URL.createObjectURL(file));
              }}
              className="w-full text-sm"
            />
          </Field>
        </div>

        <div className="card-surface space-y-4 p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">Thư viện Family Revit</h3>
          <Field label="Hướng dẫn thanh toán (hiện cho người mua family trả phí)">
            <textarea
              name="paymentInstructions"
              defaultValue={settings.paymentInstructions ?? ''}
              rows={4}
              placeholder="VD: Chuyển khoản STK ... Ngân hàng ... rồi liên hệ Zalo 09xx để được duyệt tải nhanh."
              className={inputClass}
            />
          </Field>
          <Field label="Hướng dẫn thanh toán (Tiếng Anh)">
            <textarea
              name="paymentInstructionsEn"
              defaultValue={settings.paymentInstructionsEn ?? ''}
              rows={4}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="card-surface space-y-4 p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">SEO mặc định</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Meta title mặc định">
              <input name="defaultMetaTitle" defaultValue={settings.defaultMetaTitle} className={inputClass} />
            </Field>
            <Field label="Meta title mặc định (Tiếng Anh)">
              <input name="defaultMetaTitleEn" defaultValue={settings.defaultMetaTitleEn ?? ''} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Meta description mặc định">
              <textarea name="defaultMetaDescription" defaultValue={settings.defaultMetaDescription} rows={2} className={inputClass} />
            </Field>
            <Field label="Meta description mặc định (Tiếng Anh)">
              <textarea name="defaultMetaDescriptionEn" defaultValue={settings.defaultMetaDescriptionEn ?? ''} rows={2} className={inputClass} />
            </Field>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-surface space-y-3 p-6">
          <Field label="Logo">
            {logoPreview ? (
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-lg bg-ink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoPreview} alt="Logo" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ) : null}
            <input
              type="file"
              name="logoUrl"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setLogoPreview(URL.createObjectURL(file));
              }}
              className="w-full text-sm"
            />
          </Field>
        </div>

        {saved ? <p className="rounded-lg bg-accent-50 p-3 text-center text-sm font-semibold text-accent-600">Đã lưu thay đổi!</p> : null}
        <button type="submit" className="btn-primary w-full">
          Lưu cài đặt
        </button>
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
