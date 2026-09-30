'use client';

import { useState } from 'react';
import { saveStatItems } from '@/lib/actions/stats';

const inputClass =
  'w-full rounded-lg border border-ink-200 p-2.5 text-sm focus:border-accent-500 focus:outline-none';

const ICON_OPTIONS = ['Award', 'Building2', 'Users', 'GraduationCap', 'BookOpen', 'CheckCircle2'];

type StatItem = {
  id: string;
  icon: string;
  value: string;
  label: string;
  labelEn: string | null;
};

export function StatsForm({ items }: { items: StatItem[] }) {
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        await saveStatItems(formData);
        setSaved(true);
      }}
      className="card-surface space-y-4 p-6"
    >
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">
        Số liệu thống kê (dải số ở đầu trang chủ)
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-1 gap-3 rounded-lg border border-ink-100 p-4 sm:grid-cols-4">
            <input type="hidden" name="id" value={item.id} />
            <Field label="Icon">
              <select name={`icon-${item.id}`} defaultValue={item.icon} className={inputClass}>
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Số liệu">
              <input name={`value-${item.id}`} defaultValue={item.value} className={inputClass} />
            </Field>
            <Field label="Nhãn (Tiếng Việt)">
              <input name={`label-${item.id}`} defaultValue={item.label} className={inputClass} />
            </Field>
            <Field label="Nhãn (Tiếng Anh)">
              <input name={`labelEn-${item.id}`} defaultValue={item.labelEn ?? ''} className={inputClass} />
            </Field>
          </div>
        ))}
      </div>

      {saved ? <p className="rounded-lg bg-accent-50 p-3 text-center text-sm font-semibold text-accent-600">Đã lưu thay đổi!</p> : null}
      <button type="submit" className="btn-primary">
        Lưu số liệu thống kê
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</label>
      {children}
    </div>
  );
}
